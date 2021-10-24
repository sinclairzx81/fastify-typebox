import FastifyTypeBox, { Type } from 'fastify-typebox'

// -----------------------------------------------------------------
// Fastify Scripting Example
// -----------------------------------------------------------------

const fastify = FastifyTypeBox()

const Box = Type.Box({
    Vector: Type.Object({
        x: Type.Number(),
        y: Type.Number()
    })
}, { $id: 'Box' })

fastify.addSchema(Box)

fastify.get('/echo/vector', { 
    schema: {
        querystring: Type.Ref(Box, 'Vector'),
        response: {
            200: Type.Ref(Box, 'Vector')
        }
    }
}, (req, res) => {
    res.status(200).send(req.query)
})

fastify.listen(5000)