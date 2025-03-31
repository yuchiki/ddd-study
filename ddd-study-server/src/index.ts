import { serve } from '@hono/node-server'

import { newApp } from './app'
import { InMemoryPostRepository } from './infrastructures/in_memory/in_memory_post_repository'
import { InMemoryUserRepository } from './infrastructures/in_memory/in_memory_user_repository'

const app = newApp(new InMemoryPostRepository(), new InMemoryUserRepository())

serve(app)
