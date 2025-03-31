import { right } from 'fp-ts/lib/Either'

import { UseCaseResponse } from './helper'
import { Post } from '../models/post'
import { PostRepository } from '../repositories/post_repository'

export const createPost = (user_id: string, content: string, PostRepository: PostRepository): UseCaseResponse<never, Post> => {
  const post: Omit<Post, 'id'> = {
    userId: user_id,
    content: content,
  }
  return right(PostRepository.createPost(post))
}
