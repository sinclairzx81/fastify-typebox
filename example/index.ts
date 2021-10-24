import Fastify from 'fastify'
import { FastifyTypeBox } from 'fastify-typebox'

const fastify = Fastify() as FastifyTypeBox

function plugin(instance: FastifyTypeBox, options: boolean, done: any) {

    instance.get('/:param', (req, res) => {

        console.log('param:', req.params.param)

        res.status(200).send('hello world')
    })
    done()
}

fastify.register(plugin, true) 


fastify.listen(5000)
