import FastifyTypeBox, { Type, FastifyTypeBoxInstance } from 'fastify-typebox'

const fastify = FastifyTypeBox()

function plugin(instance: FastifyTypeBoxInstance, options: boolean, done: any) {

    instance.get('/hello/:world', (req, res) => res.send(req.params.world))

    done()
}

fastify.register(plugin, true)

fastify.listen(5000)
