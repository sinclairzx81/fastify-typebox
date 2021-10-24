<div align='center'>

<h1>Fastify TypeBox</h1>

<p>Enhanced TypeBox support for Fastify</p>

[![npm version](https://badge.fury.io/js/fastify-typebox.svg)](https://badge.fury.io/js/fastify-typebox)

</div>

## Install

```bash
$ npm install fastify-typebox --save
```

## Overview

This library provides enhanced TypeBox support for Fastify. It enables automatic type inference for Fastify requests with no additional type hinting required. This library works by remapping the Fastify TypeScript interface to be fully TypeBox aware, and achieves this through the TypeScript type system.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents

- [Usage](#Usage)
- [Request](#Request)
- [Params](#Params)
- [Reply](#Reply)
- [Plugins](#Plugins)

## Usage

The following demonstrates general usage. You can test automatic type inference [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAMQIYGcbAGYE8A0cDecAKlmAKZwC+cGUEIcA5BqutgLQylkBGEAHowCwAKFEBjCADs0NVpixwAvInnYAFAEpRolmgUA6SGnWMA9EgAmlxnkKi4juCnEALMiCQAuAg6f++SywfEnIDAHkeACsycRh1fD9-ZLh+EO4DADkAVxAeMigtHCSUp2DiDJy8gq0S-0pNYpFSuCgyFEgZMh9E5panACYABiH0sMiYuIS6-sc2lGyAGxgxsizc-MLtPtmGmcdKEsORSjx1NoBHPDawRaxNZQA+XzEduEkZeEJ+PEVqFUuBkCilmpTMZjgXHIcAAQhAgsoXqDkSjQeCnGk4FINgV9qj8WiIY5ytjqlA8QTKSl0ccSjc7gY0EgYNkUOphkNNIyyFJLAlWu0litUnAANRwEENODoqEUADKPMsiPUFKpaulRLm7U6KG6BAFC2WPlJmyoqvVlPRDyUzwAbhBgJZRA0gA).

```typescript
import Fastify, { Type } from 'fastify-typebox'

const fastify = Fastify()

fastify.post('/add', { 
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
}, (req, reply) => {

    const { x, y } = req.body                  // type Body = {
                                               //   x: number
                                               //   y: number
                                               // }

    reply.status(200).send({ result: x + y  }) // type Send = (
                                               //    response: { result: number }
                                               // ) => void
})
```

## Request

Fastify TypeBox request handling works exactly the same as Fastify. However you must specify schemas as TypeBox types. Fastify TypeBox will then automatically infer the correct types in the Fastify route handlers.

```typescript
fastify.get('/records', {
    schema: {
        querystring: Type.Object({
            offset: Type.Integer({ minimum: 0 }),
            limit: Type.Integer({ maximum: 64 }),
        }),
        response: {
            200: Type.Array(
                Type.Object({
                    id: Type.String({format: 'uuid' }),
                    email: Type.String({format: 'email' })
                })
            )
        }
    }
}, async (request, reply) => {
    const { offset, limit } = request.query
    const records = await get(offset, limit)
    reply.status(200).send(records)
})
```

## Params

Fastify TypeBox supports automatically inferring param objects from urls. Param properties are always inferred as type string.

```typescript
fastify.get('/users/:userId', (request, reply) => {
    const { userId } = request.params // userId is string
})
```

## Reply

Fastify TypeBox provides static type checking of Fastify response types. Users must call `status(...)` prior to calling `send(...)`. The specified status code is used to select the appropriate response schema.

```typescript
fastify.get('/action', {
    schema: {
        response: {
            200: Type.String(),
            401: Type.Boolean(),
            500: Type.Number(),
        }
    }
}, (request, reply) => {
    reply.status(200).send('ok')  // must be string
    reply.status(401).send(false) // must be boolean
    reply.status(500).send(42)    // must be number
})
```

## Plugins

Fastify TypeBox includes mappings for Fastify plugins. You will need to specify `FastifyTypeBoxInstance` instead of `FastifyInstance` for the instance parameter. This permits to plugin to be registered on the Fastify TypeBox instance.

```typescript
import { FastifyTypeBoxInstance } from 'fastify-typebox'

export function MyPlugin(instance: FastifyTypeBoxInstance, options: { config: any }, done: Function) {

    instance.get('/foo/:id', (req, reply) => reply.send(req.params.id))

    instance.get('/bar', (req, reply) => { /* ... */ })

    instance.get('/baz', (req, reply) => { /* ... */ })

    done()
}

...

fastify.register(MyPlugin, { config: 'xyz' })
```
