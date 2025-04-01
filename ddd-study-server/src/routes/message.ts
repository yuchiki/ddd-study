import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { JwtPayload, verify } from 'jsonwebtoken'
import { z } from 'zod'

import { PostRepository } from '../repositories/post_repository'

export const registerPostMessage = (app: Hono, postRepository: PostRepository): void => {
  app.post('/message', zValidator('json',
    z.object({
      content: z.string(),
    }),
  ), (c) => {
    const authorization = c.req.header('Authorization')
    const token = authorization?.split(' ')[1]
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
      const decoded = verify(token, 'honya')
      console.log(decoded)

      const userId: string = (decoded as JwtPayload).userId as string

      const post = postRepository.createPost({ userId: userId, content: c.req.valid('json').content })
      return c.json(post)
    }

    catch (e) {
      console.log(e)
      return c.json({ error: 'Something Wrong' }, 500)
    }
  })
}
