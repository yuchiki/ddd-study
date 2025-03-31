import { User } from '../models/user'

export interface UserRepository {
  getUserById(id: string): User | null
  createUser(user: Omit<User, 'id'>): User | null
  listUsers(): User[] | null
}
