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

## Usage

The following demonstrates general usage. You can test automatic type inference [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAMQIYGcbAGYE8A0cDeiq62AKlmAKYBCEAHgJIB2aSTAxpXuVXAL5wMUCCDgByDMUxYAtDAqUARvTEBYAFAb2EFvElppcALxED2ABQBKOKlMksPGvWasOlDRv32AdJDTmxAHokABMQsTxCDTgYuBR2AAtKECQALgJo2KzlEKx0x28AeUUAK0p2GHN8TKzauDp8hW8AOQBXEEVKKCscGrrYvLgCto6uqz6svkte9X64KEoUSBZKdOrZudiAJgAGHcaqItLyyvXN-oWUVoAbGAPKFvbO7ssJ-qm3mL4+7-U+PHMCwAjngFmBrlhrEYAHwZTQbGLaXQEep4LD8YzzShA7w5dHnfqBQJweS8Wi5TFnAnUmnnImxBpwJhPLqfWnsgn0mKDZmjKBsjmCur0359MEQ7ysGCtFDmXY7SySyhMEJVLFXW7pOhwADUcHxUzg9NJlDgAGVlSFMeYBUK7UbibFLssUKsUZcbncmSyoPxbfbBfSobCAG4QYAhDRTIA).

```typescript
import Fastify, { FastifyTypeBoxInstance, Type } from 'fastify-typebox'

const fastify = Fastify() as FastifyTypeBoxInstance

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
Alternatively, you can use the FastifyTypeBox() function to return a FastifyTypeBoxInstance without type assertion.

```typescript
import FastifyTypeBox, { Type } from 'fastify-typebox'

const fastify = FastifyTypeBox()
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

