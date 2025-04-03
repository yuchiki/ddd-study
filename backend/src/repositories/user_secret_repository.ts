export interface UserSecretRepository {
  authenticateUser(userId: string, password: string): boolean
  createUserSecret(userId: string, password: string): void
}
