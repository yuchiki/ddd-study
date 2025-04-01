import { inject, injectable } from 'inversify'
import { JwtPayload, verify } from 'jsonwebtoken'

import { INJECT_TARGETS } from '../inject_targets'
import { User } from '../models/user'
import { UserRepository } from '../repositories/user_repository'

@injectable()
export class GetAuthenticatedUserUseCase {
  constructor(
   @inject(INJECT_TARGETS.UserRepository) private userRepository: UserRepository,
  ) {}

  getAuthenticatedUser(authorization: string): User | null {
    const token = authorization.split(' ')[1]
    if (!token) return null

    try {
      const decoded = verify(token, 'honya')
      console.log(decoded)

      const userId: string = (decoded as JwtPayload).userId as string
      const user = this.userRepository.getUserById(userId)
      if (!user) {
        return null
      }
      return user
    }
    catch (e) {
      console.log(e)
      return null
    }
  }
}
