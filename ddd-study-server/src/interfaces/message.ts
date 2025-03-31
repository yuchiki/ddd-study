import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { PostRepository } from '../repositories/post_repository'

export const registerPostMessage = (app: Hono, postRepository: PostRepository): void => {
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
}
