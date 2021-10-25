import Fastify, { FastifyTypeBoxInstance, FastifyInstance } from 'fastify-typebox'
import fastifySwagger from 'fastify-swagger'

// -----------------------------------------------------------------
// Fastify Scripting Example
// -----------------------------------------------------------------

const fastify = Fastify()

async function ft_async(instance: FastifyTypeBoxInstance, options: { config: number }) {
    // ...   
}

function ft_sync(instance: FastifyTypeBoxInstance, options: { config: number }, done: Function) {
    // ...
}

async function t_async(instance: FastifyInstance, options: { config: number }, done: Function) {
    // ...
}


function t_sync(instance: FastifyInstance, options: { config: number }, done: Function) {
    // ...
}

fastify.register(ft_async, { config: 1 })
fastify.register(ft_sync, { config: 1 })
fastify.register(t_async, { config: 1 })
fastify.register(t_sync, { config: 1 })
fastify.register(fastifySwagger, {})



