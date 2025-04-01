import { serve } from '@hono/node-server'

import { DDDStudyAPIServer } from './app'
import { INJECT_TARGETS } from './inject_targets'
import { container } from './inversify.config'

const server = container.get<DDDStudyAPIServer>(INJECT_TARGETS.DDDStudyAPIServer)

serve(server.getApp())
