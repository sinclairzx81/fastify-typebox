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

Fastify TypeBox offers enhanced TypeBox support for Fastify. It enables automatic type inference for requests with no additional type hinting required. Fastify TypeBox is implemented entirely through the TypeScript type system.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents

- [Overview](#Overview)
- [Usage](#Usage)
- [Request](#Request)
- [Params](#Params)
- [Reply](#Reply)

## Usage

The following example demonstrates general usage. You can also test it out [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKYBoXowIQgA8BRAOwEMAjAGwwBM4BfOAMyghDgHJWKBnGMFaoAtDDxVi3ALAAoUJFhwAYgKEi4W7Tt3b2nHn0HDUsufIDGEMoLbrTcALyqHIgBQBKOANyZCpJS0DDoA9KFw5NR0cBhkABYUZJYhaP7EcPwArmBKMPLyxhqoAHSQgu7coRT09Nw4SPI6-JbxGCAUAFyITXpwUvSo3WkYJQDyVABWGJYw7gi9fdpEw3glAHJZIFQYUF5Yi0twQ36jm9u7Xoc6TJ4HcktQGPyQthjdCw9HWgBMAAx-VaYcZTGZzT7fPRPbI0GBAs5bHZ7TzXPq3VFaJiHLFyJg4dxPACOOCeYBoqG8TgAfD0LF8tNZbPAkEQcKhmM44ESSgN2ZC9OE4BJMHBCINORD+VLpX1BVoVnAyIjdhiZWqjnLjt0lRcoKr1QawhEcYdSeSSoIKDAsvx3P8-p4LXF6PMuc8srDukQ4ABqY6Y7yC4UYOAAZWdnPc+sNhs1bpeNn470Q8Y9cMVyqgzGjMfVgspNIAbhBgPR5LcgA).

```typescript
import FastifyTypeBox, { Type } from 'fastify-typebox'

const fastify = FastifyTypeBox()

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

