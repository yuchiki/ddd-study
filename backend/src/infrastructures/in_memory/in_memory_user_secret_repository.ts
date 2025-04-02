import { createHash } from 'crypto'

import { injectable } from 'inversify'

import { UserSecret } from '../../models/userSecret'
import { UserSecretRepository } from '../../repositories/user_secret_repository'

@injectable()
export class InMemoryUserSecretRepository implements UserSecretRepository {
  secrets: UserSecret[] = [
    {
      id: '1',
      salt: 'salt1',
      hashedPassword: '661c49fc16244a98408249c512ebcfa1f59abb290dee4bed4a9f304375e0e0c2',
    },
    {
      id: '2',
      salt: 'salt2',
      hashedPassword: '3748392c4a921918e6547cd44209a76fac3524c30b4e5c3ea06d1889ec92a4ef',
    },
  ]

  authenticateUser(userId: string, password: string): boolean {
    const hash = createHash('sha256')

    console.log(`userId: ${userId}, password: ${password}`)

    const user = this.secrets.find(user => user.id === userId)
    if (!user) {
      return false
    }

    hash.update(user.salt + password)
    const hashedPassword = hash.digest('hex')
    return user.hashedPassword === hashedPassword
  }
}
