import { left, right } from 'fp-ts/lib/Either'

import { UseCaseResponse } from './helper'
import { Post } from '../models/post'
import { User } from '../models/user'
import { PostRepository } from '../repositories/post_repository'
import { UserRepository } from '../repositories/user_repository'

type FulfilledPost = Post & { user: User }
class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`UserId ${userId} not found`)
  }
}

export const getGlobalTimeline = (postRepository: PostRepository, userRepository: UserRepository): UseCaseResponse<UserNotFoundError, Post[]> => {
  const rawPosts = postRepository.listPosts()

  const posts: FulfilledPost[] = []
  for (const rawPost of rawPosts) {
    const user = userRepository.getUserById(rawPost.userId)
    if (user === null) {
      return left(new UserNotFoundError(rawPost.userId))
    }
    posts.push({ ...rawPost, user })
  }

  return right(posts)
}
