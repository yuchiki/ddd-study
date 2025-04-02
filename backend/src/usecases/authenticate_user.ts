import { inject, injectable } from 'inversify'

import { INJECT_TARGETS } from '../inject_targets'
import { User } from '../models/user'
import { UserRepository } from '../repositories/user_repository'
import { UserSecretRepository } from '../repositories/user_secret_repository'

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject(INJECT_TARGETS.UserRepository) private readonly userRepository: UserRepository,
    @inject(INJECT_TARGETS.UserSecretRepository) private readonly userSecretRepository: UserSecretRepository,
  ) {
  }

  authenticateUser(username: string, password: string): User | null {
    const user = this.userRepository.getUserByUsername(username)
    if (!user) {
      return null
    }

    if (!this.userSecretRepository.authenticateUser(user.id, password)) {
      return null
    }

    return user
  }
}
