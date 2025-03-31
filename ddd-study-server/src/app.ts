import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
// eslint-disable-next-line import/no-unresolved
import { logger } from 'hono/logger'
import { z } from 'zod'

import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'
import { getGlobalTimeline } from './usecases/get_global_timeline'

export const newApp = (postRepository: PostRepository, userRepository: UserRepository): Hono => {
  const app = new Hono()
  app.use(logger())
  app.get('/', c => c.text('Hello Node.js!'))
  app.get('/timeline', (c) => {
    const post = getGlobalTimeline(postRepository, userRepository)
    return c.json(post)
  })

  app.post('/message', zValidator('json',
    z.object({
      userId: z.string(),
      content: z.string(),
    }),
  ), (c) => {
    const body = c.req.valid('json')
    const post = postRepository.createPost({ userId: body.userId, content: body.content })
    return c.json(post)
  })

  return app
}
