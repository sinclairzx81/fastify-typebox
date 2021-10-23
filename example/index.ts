import { Type, FastifyTypeBox } from 'fastify-typebox'
import Fastify from 'fastify'

const fastify = Fastify() as FastifyTypeBox

// -----------------------------------------------------------------
// Get
// -----------------------------------------------------------------

fastify.get('/', { 
    schema: { 
        querystring: Type.Object({ 
            name: Type.String() 
        }),
        response: {
            200: Type.String()
        }
    }
}, (req, reply) => {
    reply.status(200).send(req.query.name)
})

// -----------------------------------------------------------------
// Post
// -----------------------------------------------------------------

const PostSchema = {
    body: Type.Object({
        option: Type.Boolean()
    }),
    response: {
        200: Type.String(),
        500: Type.Boolean()
    }
}

fastify.post('/post', { schema: PostSchema }, (req, reply) => {
    if(req.body.option === true) {
        reply.status(200).send("Ok")
    } else {
        reply.status(500).send(false)
    }
})

// -----------------------------------------------------------------
// Route
// -----------------------------------------------------------------

fastify.route({
    method: 'GET',
    url: '/route',
    schema: {
        querystring: Type.Object({
            a: Type.Number(),
            b: Type.Number()
        }),
        response: {
            200: Type.Object({
                hello: Type.String()
            })
        }
    },
    handler: (request, reply) => {
        reply.status(200).send({ hello: 'world' })
    }
})

fastify.listen(5000)
