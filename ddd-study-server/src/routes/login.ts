import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'

import { UserRepository } from '../repositories/user_repository'
import { UserSecretRepository } from '../repositories/user_secret_repository'

export const registerPostLogin = (app: Hono, userRepository: UserRepository, userSecretRepository: UserSecretRepository): void => {
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
