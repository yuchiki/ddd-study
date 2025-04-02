import { serve } from '@hono/node-server'

import { DDDStudyAPIServer } from './app'
import { INJECT_TARGETS } from './inject_targets'
import { container } from './inversify.config'

const PORT = Number(process.env.BACKEND_PORT) || 3000

const server = container.get<DDDStudyAPIServer>(INJECT_TARGETS.DDDStudyAPIServer)

serve({ fetch: server.getApp().fetch, port: PORT }, (p) => {
  console.log(`Server is running at port ${p.port.toString()}`,

  )
})
