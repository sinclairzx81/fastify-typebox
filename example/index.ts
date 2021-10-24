import Fastify, { Type } from 'fastify-typebox'

// -----------------------------------------------------------------
// Fastify Scripting Example
// -----------------------------------------------------------------

const fastify = Fastify()

fastify.get('/hello/:world', { 
    schema: {
        response: {
            200: Type.String()
        }
    } 
}, (req, res) => {
    res.status(200).send(req.params.world)
})
