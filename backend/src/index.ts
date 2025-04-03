import { INJECT_TARGETS } from './inject_targets'
import { container } from './inversify.config'
import { DDDStudyAPIServer } from './web_server'

const PORT = Number(process.env.BACKEND_PORT) || 3000

const server = container.get<DDDStudyAPIServer>(INJECT_TARGETS.DDDStudyAPIServer)

server.serve(PORT, (p) => {
  console.log(`Server is running at port ${p.port.toString()}`,
  )
})
