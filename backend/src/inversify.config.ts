import { Container } from 'inversify'

import 'reflect-metadata'

import { DDDStudyAPIServer } from './web_server'
import { InMemoryPostRepository } from './infrastructures/in_memory/in_memory_post_repository'
import { InMemoryUserRepository } from './infrastructures/in_memory/in_memory_user_repository'
import { InMemoryUserSecretRepository } from './infrastructures/in_memory/in_memory_user_secret_repository'
import { INJECT_TARGETS } from './inject_targets'
import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'
import { UserSecretRepository } from './repositories/user_secret_repository'
import { AuthenticateUserUseCase } from './usecases/authenticate_user'
import { CreatePostUseCase as CreatePostUseCase } from './usecases/create_post'
import { GetGlobalTimelineUseCase } from './usecases/get_global_timeline'

export const container = new Container()

// repositories
container.bind<PostRepository>(INJECT_TARGETS.PostRepository).to(InMemoryPostRepository).inSingletonScope()
container.bind<UserRepository>(INJECT_TARGETS.UserRepository).to(InMemoryUserRepository).inSingletonScope()
container.bind<UserSecretRepository>(INJECT_TARGETS.UserSecretRepository).to(InMemoryUserSecretRepository).inSingletonScope()

// usecases
container.bind<CreatePostUseCase>(INJECT_TARGETS.CreatePostUseCase).to(CreatePostUseCase).inSingletonScope()
container.bind<GetGlobalTimelineUseCase>(INJECT_TARGETS.GetGlobalTimeLineUseCase).to(GetGlobalTimelineUseCase).inSingletonScope()
container.bind<AuthenticateUserUseCase>(INJECT_TARGETS.authenticateUserUseCase).to(AuthenticateUserUseCase).inSingletonScope()

// app
container.bind<DDDStudyAPIServer>(INJECT_TARGETS.DDDStudyAPIServer).to(DDDStudyAPIServer).inSingletonScope()
