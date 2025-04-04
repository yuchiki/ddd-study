import { AddressInfo } from 'node:net'

import { serve as original_serve, ServerType } from '@hono/node-server'
import { Options } from '@hono/node-server/dist/types'
import { zValidator } from '@hono/zod-validator'
import { isLeft } from 'fp-ts/lib/Either'
import { Hono } from 'hono'
// eslint-disable-next-line import/no-unresolved
import { cors } from 'hono/cors'
// eslint-disable-next-line import/no-unresolved
import { jwt, sign } from 'hono/jwt'
// eslint-disable-next-line import/no-unresolved
import { logger } from 'hono/logger'
import { inject, injectable } from 'inversify'
import { Server } from 'socket.io'
import { z } from 'zod'

import { INJECT_TARGETS } from './inject_targets'
import { AuthenticateUserUseCase } from './usecases/authenticate_user'
import { CreatePostUseCase } from './usecases/create_post'
import { CreateUserUseCase } from './usecases/create_user'
import { GetGlobalTimelineUseCase } from './usecases/get_global_timeline'

import type { JwtVariables } from 'hono/jwt'

const JWT_SECRET = 'honya'

type Variables = JwtVariables<{
  sub: string
}>
type App = Hono<{ Variables: Variables }>

@injectable()
export class DDDStudyAPIServer {
  private app: App

  constructor(
    @inject(INJECT_TARGETS.authenticateUserUseCase) private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    @inject(INJECT_TARGETS.CreatePostUseCase) private readonly createPostUseCase: CreatePostUseCase,
    @inject(INJECT_TARGETS.GetGlobalTimeLineUseCase) private readonly getGlobalTimelineUseCase: GetGlobalTimelineUseCase,
    @inject(INJECT_TARGETS.createUserUseCase) private readonly createUserUseCase: CreateUserUseCase,
  ) {
  }

  getApp(): App {
    const app = new Hono<{ Variables: Variables }>()
    app.use(logger())
    app.use('/*', cors({
      origin: 'http://localhost:3000',
    }))

    app.post('/login',
      zValidator('json',
        z.object({
          username: z.string(),
          password: z.string(),
        })),

      async (c) => {
        const { username, password } = c.req.valid('json')
        const user = this.authenticateUserUseCase.authenticateUser(username, password)
        if (!user) {
          return c.text('Unauthorized', 401)
        }

        const payload = {
          sub: user.id,
          exp: Math.floor(Date.now() / 1000) + 60 * 5,
        }
        const token = await sign(payload, JWT_SECRET)
        return c.json({ token })
      })

    app.get('/timeline', (c) => {
      const posts = this.getGlobalTimelineUseCase.getGlobalTimeline()
      return c.json(posts)
    })

    app.use('/message', jwt({ secret: JWT_SECRET }))
    app.post('/message', zValidator('json',
      z.object({
        content: z.string(),
      }),
    ), (c) => {
      const { sub } = c.get('jwtPayload')
      const { content } = c.req.valid('json')

      const post = this.createPostUseCase.createPost(sub, content)

      return isLeft(post)
        ? c.text('Internal Server Error', 500)
        : c.json(post)
    })

    app.post('/signup', zValidator('json',
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    ), (c) => {
      const { username, password } = c.req.valid('json')
      const user = this.createUserUseCase.createUser(username, password)
      if (isLeft(user)) {
        return c.text('Unauthorized', 401)
      }

      return c.json(user)
    })

    return app
  }

  getIoServer(server: ServerType): Server {
    const ioServer = new Server(server, {
      path: '/socket.io',
      serveClient: false,
      cors: {
        origin: 'http://localhost:3000',
      },
    })

    ioServer.on('error', (err) => {
      console.log(err)
    })
    ioServer.on('connection', () => {
      console.log('Client connected')
    })

    ioServer.on('disconnect', () => {
      console.log('Client disconnected')
    })

    setInterval(() => {
      const posts = this.getGlobalTimelineUseCase.getGlobalTimeline()
      ioServer.emit('timelineListener', posts)
    }, 1000)

    return ioServer
  }

  serve(port: number, listeningListener?: (info: AddressInfo) => void): Server {
    const app = this.getApp()
    const options: Options = {
      fetch: app.fetch,
      port,
    }
    const server = original_serve(options, listeningListener)
    return this.getIoServer(server)
  }
}
