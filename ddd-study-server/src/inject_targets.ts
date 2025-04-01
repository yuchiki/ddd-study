export const INJECT_TARGETS = {
  // UseCase
  CreatePostUseCase: Symbol.for('CreatePostUseCase'),
  GetGlobalTimeLineUseCase: Symbol.for('GetGlobalTimeLineUseCase'),
  GetAuthenticatedUserUseCase: Symbol.for('GetAuthenticatedUserUseCase'),
  authenticateUserUseCase: Symbol.for('authenticateUserUseCase'),

  // Repository
  PostRepository: Symbol.for('PostRepository'),
  UserRepository: Symbol.for('UserRepository'),
  UserSecretRepository: Symbol.for('UserSecretRepository'),

  // App
  DDDStudyAPIServer: Symbol.for('DDDStudyAPIServer'),

}
