import { right } from 'fp-ts/lib/Either'
import { inject, injectable } from 'inversify'

import { UseCaseResponse } from './helper'
import { INJECT_TARGETS } from '../inject_targets'
import { Post } from '../models/post'
import { PostRepository } from '../repositories/post_repository'

@injectable()
export class CreatePostUseCase {
  constructor(
    @inject(INJECT_TARGETS.PostRepository) private readonly postRepository: PostRepository,
  ) {
  }

  createPost(user_id: string, content: string): UseCaseResponse<never, Post> {
    const post: Omit<Post, 'id'> = {
      userId: user_id,
      content: content,
    }
    return right(this.postRepository.createPost(post))
  }
}
