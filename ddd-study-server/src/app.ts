import { zValidator } from '@hono/zod-validator'
import { isLeft } from 'fp-ts/lib/Either'
import { Hono } from 'hono'
// eslint-disable-next-line import/no-unresolved
import { logger } from 'hono/logger'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'

import { INJECT_TARGETS } from './inject_targets'
import { container } from './inversify.config'
import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'
import { UserSecretRepository } from './repositories/user_secret_repository'
import { CreatePostUseCase } from './usecases/create_post'
import { GetAuthenticatedUserUseCase } from './usecases/get_authenticated_user'
import { GetGlobalTimelineUseCase } from './usecases/get_global_timeline'
const getAuthenticatedUserUseCase = container.get<GetAuthenticatedUserUseCase>(INJECT_TARGETS.GetAuthenticatedUserUseCase)
const createPostUseCase = container.get<CreatePostUseCase>(INJECT_TARGETS.CreatePostUseCase)

export const registerPostMessage = (app: Hono): void => {
  app.post('/message', zValidator('json',
    z.object({
      content: z.string(),
    }),
  ), (c) => {
    const authorization = c.req.header('Authorization')
    if (!authorization) {
      return c.text('Unauthorized', 401)
    }

    const user = getAuthenticatedUserUseCase.getAuthenticatedUser(authorization)

    if (!user) {
      return c.text('Unauthorized', 401)
    }

    const { content } = c.req.valid('json')

    const post = createPostUseCase.createPost(user.id, content)
    if (isLeft(post)) {
      return c.text('Internal Server Error', 500)
    }

    return c.json(post)
  })
}

const getGlobalTimelineUseCase = container.get<GetGlobalTimelineUseCase>(INJECT_TARGETS.GetGlobalTimeLineUseCase)

const registerGetTimeline = (app: Hono): void => {
  app.get('/timeline', (c) => {
    const posts = getGlobalTimelineUseCase.getGlobalTimeline()
    console.log(posts)
    return c.json(posts)
  })
}

const registerPostLogin = (app: Hono, userRepository: UserRepository, userSecretRepository: UserSecretRepository): void => {
  app.post('/login',
    zValidator('json',
      z.object({
        username: z.string(),
        password: z.string(),
      })),

    (c) => {
      const { username, password } = c.req.valid('json')

      // get user  id

      const user = userRepository.getUserByUsername(username)
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (!userSecretRepository.authenticateUser(user.id, password)) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const token = sign({ userId: user.id }, 'honya', {
        expiresIn: '1h',
      })

      return c.json({ token })
    })
}

export const newApp = (postRepository: PostRepository, userRepository: UserRepository, userSecretRepository: UserSecretRepository): Hono => {
  const app = new Hono()
  app.use(logger())
  app.get('/', c => c.text('Hello Node.js!'))

  registerGetTimeline(app)
  registerPostMessage(app)
  registerPostLogin(app, userRepository, userSecretRepository)

  return app
}
