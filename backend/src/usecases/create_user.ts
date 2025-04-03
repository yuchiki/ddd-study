import { left, right } from 'fp-ts/lib/Either'
import { inject, injectable } from 'inversify'

import { UseCaseResponse } from './helper'
import { INJECT_TARGETS } from '../inject_targets'
import { User } from '../models/user'
import { UserRepository } from '../repositories/user_repository'
import { UserSecretRepository } from '../repositories/user_secret_repository'

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(INJECT_TARGETS.UserRepository) private readonly userRepository: UserRepository,
    @inject(INJECT_TARGETS.UserSecretRepository) private readonly userSecretRepository: UserSecretRepository,
  ) {
  }

  createUser(username: string, password: string): UseCaseResponse<'', User> {
    if (this.userRepository.getUserByUsername(username)) {
      return left('')
    }

    const user = this.userRepository.createUser({
      username,
    })

    if (!user) {
      return left('')
    }

    this.userSecretRepository.createUserSecret(user.id, password)

    return right(user)
  }
}
