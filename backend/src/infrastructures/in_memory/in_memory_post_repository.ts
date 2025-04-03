import { injectable } from 'inversify'

import { Post } from '../../models/post'
import { PostRepository } from '../../repositories/post_repository'

@injectable()
export class InMemoryPostRepository implements PostRepository {
  posts: Post[] = []
  nextId: number = 1

  createPost(post: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.nextId.toString(),
      createdAt: new Date(),
      ...post,
    }
    this.posts.push(newPost)
    this.nextId++
    return newPost
  }

  listPosts(): Post[] {
    // Deep copy
    return this.posts.map(post => ({ ...post }))
  }
}
