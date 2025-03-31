import { Post } from '../models/post'

export interface PostRepository {
  createPost(post: Omit<Post, 'id'>): Post
  listPosts(): Post[]
}
