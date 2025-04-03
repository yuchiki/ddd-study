import { Post } from '../models/post'

export interface PostRepository {
  createPost(post: Omit<Post, 'id' | 'createdAt'>): Post
  listPosts(): Post[]
}
