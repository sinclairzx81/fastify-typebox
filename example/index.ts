import { Type, FastifyTypeBox } from 'fastify-typebox'
import Fastify                  from 'fastify'

// -------------------------------------------------------------
// Enable TypeBox compatibility
// -------------------------------------------------------------

const fastify = Fastify({ }) as FastifyTypeBox

// -------------------------------------------------------------
// Define Fastify Schema with TypeBox
// -------------------------------------------------------------

const schema = {
    body: Type.Object({
        email: Type.String({ format: 'email'})
    }),
    response: {
        200: Type.Object({
            x: Type.Number(),
            y: Type.Number()
        })
    }
}

// -------------------------------------------------------------
// Define Route
// -------------------------------------------------------------

fastify.post('/', { schema }, (req, reply) => {
    
    // email is string
    const { email } = req.body

    // status 200 response statically checked.
    reply.status(200).send({ x: 1, y: 2 }) 
})