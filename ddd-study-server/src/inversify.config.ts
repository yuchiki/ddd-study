import { Container } from 'inversify'

import 'reflect-metadata'

import { InMemoryPostRepository } from './infrastructures/in_memory/in_memory_post_repository'
import { InMemoryUserRepository } from './infrastructures/in_memory/in_memory_user_repository'
import { INJECT_TARGETS } from './inject_targets'
import { PostRepository } from './repositories/post_repository'
import { UserRepository } from './repositories/user_repository'
import { CreatePostUseCase as CreatePostUseCase } from './usecases/create_post'
import { GetAuthenticatedUserUseCase } from './usecases/get_authenticated_user'
import { GetGlobalTimelineUseCase } from './usecases/get_global_timeline'

export const container = new Container()

// repositories
container.bind<PostRepository>(INJECT_TARGETS.PostRepository).to(InMemoryPostRepository).inSingletonScope()
container.bind<UserRepository>(INJECT_TARGETS.UserRepository).to(InMemoryUserRepository).inSingletonScope()

// usecases
container.bind<CreatePostUseCase>(INJECT_TARGETS.CreatePostUseCase).to(CreatePostUseCase).inSingletonScope()
container.bind<GetGlobalTimelineUseCase>(INJECT_TARGETS.GetGlobalTimeLineUseCase).to(GetGlobalTimelineUseCase).inSingletonScope()
container.bind<GetAuthenticatedUserUseCase>(INJECT_TARGETS.GetAuthenticatedUserUseCase).to(GetAuthenticatedUserUseCase).inSingletonScope()
