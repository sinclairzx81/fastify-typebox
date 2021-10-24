import Fastify from 'fastify'
import { Type, TypeBoxEnabled } from 'fastify-typebox'

const fastify = Fastify() as TypeBoxEnabled

fastify.get('/users/:name/age/:id', { 
    schema: {
        response: {
            200: Type.String()
        }
    }
 }, (req, res) => {
    
    console.log(req.params)

    res.status(200).send('1')
})

fastify.listen(5000)


fastify.get('/add', { 
    schema: {
        querystring: Type.Object({
            a: Type.Number(),
            b: Type.Number()
        }),
        response: {
            200: Type.Object({
                result: Type.Number()
            })
        }
    }
}, (req, reply) => {
    // query parameters automatically inferred
    const result = req.query.a + req.query.b
    
    // response type statically checked
    reply.status(200).send({ result })
})