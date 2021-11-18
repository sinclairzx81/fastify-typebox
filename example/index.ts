import Fastify, { Type } from 'fastify-typebox'

// -----------------------------------------------------------------
// Fastify Scripting Example
// -----------------------------------------------------------------

const fastify = Fastify()

fastify.post('/users/:userId', { 
    schema: {
        body: Type.Object({
            x: Type.Number(),
            y: Type.Number()
        }),
        response: {
            200: Type.Object({
                result: Type.Number()
            })
        }
    }
}, (request, reply) => {
    
    // -------------------------------------
    // Requests
    // -------------------------------------
    
    // type Params = { userId: string }

    const { userId } = request.params

    // type Body = { x: number, y: number }

    const { x, y } = request.body             

    // -------------------------------------
    // Replies
    // -------------------------------------

    // type Response = { 200: { result: number } }

    // reply.send({ result: 100 })                // error: no status code specified

    // reply.status(400).send({ result: 42 })     // error: 400 status code not defined

    // reply.status(200).send({ result: '42' })   // error: result type is not number

    reply.status(200).send({ result: x + y  })  // ok: !
})