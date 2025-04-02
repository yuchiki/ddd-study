export interface UserSecretRepository {
  authenticateUser(userId: string, password: string): boolean
}
