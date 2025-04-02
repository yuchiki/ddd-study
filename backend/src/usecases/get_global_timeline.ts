import { left, right } from 'fp-ts/lib/Either'
import { inject, injectable } from 'inversify'

import { UseCaseResponse } from './helper'
import { INJECT_TARGETS } from '../inject_targets'
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

@injectable()
export class GetGlobalTimelineUseCase {
  constructor(
    @inject(INJECT_TARGETS.PostRepository) private readonly postRepository: PostRepository,
    @inject(INJECT_TARGETS.UserRepository) private readonly userRepository: UserRepository,
  ) {}

  getGlobalTimeline(): UseCaseResponse<UserNotFoundError, Post[]> {
    const rawPosts = this.postRepository.listPosts()

    const posts: FulfilledPost[] = []
    for (const rawPost of rawPosts) {
      const user = this.userRepository.getUserById(rawPost.userId)
      if (user === null) {
        return left(new UserNotFoundError(rawPost.userId))
      }
      posts.push({ ...rawPost, user })
    }

    return right(posts)
  }
}
