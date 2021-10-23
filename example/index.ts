import { Type, FastifyTypeBox } from 'fastify-typebox'
import Fastify from 'fastify'

const fastify = Fastify() as FastifyTypeBox

// -----------------------------------------------------------------
// Get
// -----------------------------------------------------------------

fastify.get('/users/:userId', {
    schema: {
        querystring: Type.Object({
            a: Type.Number(),
            b: Type.Number()
        }),
        response: {
            200: Type.Object({})
        }
    }
}, (request, reply) => {
    
})