import { Hono } from 'hono'

import { PostRepository } from '../repositories/post_repository'
import { UserRepository } from '../repositories/user_repository'
import { getGlobalTimeline } from '../usecases/get_global_timeline'

export const RegisterGetTimeline = (app: Hono, postRepository: PostRepository, userRepository: UserRepository): void => {
  app.get('/timeline', (c) => {
    const post = getGlobalTimeline(postRepository, userRepository)
    return c.json(post)
  })
}
