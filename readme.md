<div align='center'>

<h1>Fastify-TypeBox</h1>

<p>Enhanced TypeBox support for Fastify</p>

[![npm version](https://badge.fury.io/js/fastify-typebox.svg)](https://badge.fury.io/js/fastify-typebox)

</div>

## Install

```bash
$ npm install fastify-typebox --save
```

## Overview

Fastify TypeBox offers enhanced TypeBox support for Fastify. It enables automatic type inference for requests with no additional type hinting required. Fastify TypeBox is implemented entirely through the TypeScript type system.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents

- [Overview](#Overview)
- [Usage](#Usage)
- [Enable](#Enable)
- [Request](#Request)
- [Params](#Params)
- [Reply](#Reply)

## Usage

The following example demonstrates general usage. You can also test it out [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAMQIYGcbAGYE867-gvDKCEOAcg1XW3IFgAoUSWOAb0WsywBUswApgCEIADwA0cPoLgBfOMVIUqabgFoY-AQCMx9BowD0huGrPmLlq9Zu279s0ZMBBMIIB2AE06rscAO7AMAAWPjS8WiKicJoyqCgCsMAQ7k6mDhmZWRmMjADGKWgKXH4AvGHcABQAlHCoFdjSwmK5DMbp2Z1dWWkAIgIYwO4CcCQArjAj9YJQcGMoY0gANgB0cACKY4k4SF5wAEoCKJDuCTFaKHUTEHBDGIlQAp4rad1v7zatKuErAOYCMEq5EMSE8nnIkg4jHwKDywQEICQAC52NDCHAAI5bKBYNBQIa-FFNFYAeW0ACsBHlAWw0ei8MipFoVgA5MYgbSJGriOn0uDaInMtkcrnVXn4WTVHkMemPY6FAQo2kyvm4ABMAAYNYLBKSKVSaeLVaMjmMljAdQJWezOVAakbCJKHXJebJGLJJJVHhjJI8wEssLVSgA+E3+rArNBIGDzSqajXVSMCLyVZX4OVmi0mjErLHbFZIOAAamzuexEe07uq1SAA).

```typescript
import { Type, TypeBoxEnabled } from 'fastify-typebox'
import Fastify                  from 'fastify'

const fastify = Fastify() as TypeBoxEnabled  // Enable enhanced TypeBox support

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

## Enable

Fastify TypeBox works by remapping Fastify's routing interface to make each http function TypeBox aware. To enable enhanced TypeBox support, append a Fastify instance with the TypeBoxEnabled type assertion.

```typescript
import Fastify from 'fastify'

import { TypeBoxEnabled, Type } from 'fastify-typebox'

const fastify = Fastify() as TypeBoxEnabled // Enables enhanced TypeBox support
```

## Request

Fastify request handling works exactly the same with TypeBox enabled. However when TypeBox is enabled, you must specify schemas as TypeBox types. Fastify TypeBox will then automatically infer the correct types in the Fastify route handlers.

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

