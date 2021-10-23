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

FastifyTypeBox provides enhanced TypeBox support for Fastify users. It enables automatic static type inference for Fastify routes with no additional type hinting required. FastifyTypeBox emits no additional code and is implemented entirely through the TypeScript type system.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents

- [Overview](#Overview)
- [Usage](#Usage)
- [Setup](#Setup)
- [Requests](#Requests)
- [Params](#Params)
- [Replies](#Replies)

## Usage

The following example demonstrates general usage. You can also test it out [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAMQIYGcbAGYE867-gvDKCEOAcg1XW3IFgAoUSWOAb0WsywBUswApgCEIADwA0cPoLgBfOMVIUqabgFoY-AQCMx9BowD0huGrPmLlq9Zu279s0ZMBBMIIB2AE06rscAO7AMAAWPjS8WiKicJoyqCgCsMAQ7k6mDhmZWRmMjADGKWgKXH4AvGHcABQAlHCoFdjSwmK5DMbp2Z1dWWkAIgIYwO4CcCQArjAj9YJQcGMoY0gANgB0cACKY4k4SF5wAEoCKJDuCTFaKHUTEHBDGIlQAp4rad1v7zatKuErAOYCMEq5EMSE8nnIkg4jHwKDywQEICQAC52NDCHAAI5bKBYNBQIa-FFNFYAeW0ACsBHlAWw0ei8MipFoVgA5MYgbSJGriOn0uDaInMtkcrnVXn4WTVHkMemPY6FAQo2kyvm4ABMAAYNYLBKSKVSaeLVaMjmMljAdQJWezOVAakbCJKHXJebJGLJJJVHhjJI8wEssLVSgA+E3+rArNBIGDzSqajXVSMCLyVZX4OVmi0mjErLHbFZIOAAamzuexEe07uq1SAA).

```typescript
import Fastify                  from 'fastify'
import { FastifyTypeBox, Type } from 'fastify-typebox'

// --------------------------------------------------------------------
// Append Fastify with FastifyTypeBox type assertion
// --------------------------------------------------------------------

const fastify = Fastify() as FastifyTypeBox

// --------------------------------------------------------------------
// Define route as per usual. Query and Response types auto inferred.
// --------------------------------------------------------------------

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
}, (req, reply) => reply.status(200).send({
    result: req.query.a + req.query.b
}))
```

## Setup

FastifyTypeBox works by remapping Fastify's routing interface, making each http handler function TypeBox aware. This remapping is handled entirely through the TypeScript type system. To enable, append Fastify with a FastifyTypeBox type assertion.

```typescript
import { FastifyTypeBox, Type } from 'fastify-typebox'

import Fastify from 'fastify'

const fastify = Fastify() as FastifyTypeBox // enable TypeBox auto inference
```

## Requests

FastifyTypeBox operates on TypeScript type system only, so users can expect the exact same request handling behaviour as Fastify. However by asserting Fastify with FastifyTypeBox, Fastify now requires all schemas to be passed as TypeBox types. FastifyTypeBox will take care of automatically inferring the correct types in the Fastify route handler.

```typescript
fastify.get('/records', {
    schema: {
        querystring: {
            offset: Type.Integer(),
            limit:  Type.Integer({ maximum: 64 }),
        },
        response: {
            200: Type.Array(
                Type.Object({
                    id:    Type.String({format: 'uuid' })
                    name:  Type.String(),
                    email: Type.String({format: 'email' })
                })
            )
        }
    }
}, async (request, reply) => {

    const records = await get(
        request.query.offset, 
        request.query.limit
    )

    reply.status(200).send(records)
})
```

## Params

In addition to TypeBox schemas, FastifyTypeBox will also automatically infer fastify params properties derived from urls. Param properties will always be of type `string`.

```typescript
fastify.get('/users/:userId', (request, reply) => {
    const { userId } = request.params // userId is string
})
```

## Replies

FastifyTypeBox provides static type checking of Fastify response types. FastifyTypeBox does mandate that users call `status(...)` prior to calling `send(...)`. FastifyTypeBox requires this to narrow the appropriate response type based on the status code.

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

