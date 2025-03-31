import { Hono } from 'hono'
// eslint-disable-next-line import/no-unresolved
import { logger } from 'hono/logger'

import { registerPostMessage } from './interfaces/message'
import { RegisterGetTimeline as registerGetTimeline } from './interfaces/timeline'
import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'

export const newApp = (postRepository: PostRepository, userRepository: UserRepository): Hono => {
  const app = new Hono()
  app.use(logger())
  app.get('/', c => c.text('Hello Node.js!'))

  registerGetTimeline(app, postRepository, userRepository)
  registerPostMessage(app, postRepository)

  return app
}
