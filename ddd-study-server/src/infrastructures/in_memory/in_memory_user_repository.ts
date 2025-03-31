import { User } from '../../models/user'
import { UserRepository } from '../../repositories/user_repository'

const SampleUsers: User[] = [
  {
    id: '1',
    name: 'Alice',
  },
  {
    id: '2',
    name: 'Bob',
  },

]

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [...SampleUsers]
  nextId: number = 1

  getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null
  }

  createUser(user: Omit<User, 'id'>): User | null {
    const newUser: User = {
      id: this.nextId.toString(),
      ...user,
    }
    this.users.push(newUser)
    this.nextId++
    return newUser
  }

  listUsers(): User[] | null {
    return this.users.map(user => ({ ...user }))
  }
}
