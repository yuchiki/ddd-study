import { Hono } from 'hono'
// eslint-disable-next-line import/no-unresolved
import { logger } from 'hono/logger'

import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'
import { UserSecretRepository } from './repositories/user_secret_repository'
import { registerPostLogin } from './routes/login'
import { registerPostMessage } from './routes/message'
import { RegisterGetTimeline as registerGetTimeline } from './routes/timeline'

export const newApp = (postRepository: PostRepository, userRepository: UserRepository, userSecretRepository: UserSecretRepository): Hono => {
  const app = new Hono()
  app.use(logger())
  app.get('/', c => c.text('Hello Node.js!'))

  registerGetTimeline(app, postRepository, userRepository)
  registerPostMessage(app, postRepository)
  registerPostLogin(app, userRepository, userSecretRepository)

  return app
}
