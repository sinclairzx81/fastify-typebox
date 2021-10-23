<div align='center'>

<h1>Fastify-TypeBox</h1>

<p>Automatic Type Inference for Fastify using TypeBox</p>

[![npm version](https://badge.fury.io/js/fastify-typebox.svg)](https://badge.fury.io/js/fastify-typebox)

</div>

## Install

```bash
$ npm install fastify-typebox --save
```

## Overview

FastifyTypeBox provides enhanced TypeBox support for Fastify users. It enables automatic type inference for Fastify route handlers with no additional type hinting. FastifyTypeBox is implemented entirely in the TypeScript type system and provides this functionality with a single type assertion.

Requires TypeScript 4.3.5 and above.

License MIT

## Contents

- [Overview](#Overview)
- [Usage](#Usage)
- [Setup](#Setup)
- [Requests](#Requests)
- [Replies](#Replies)

## Usage

The following example demonstrates general usage. TypeScript Playgound link [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgMQIYGcbAGYE8AquYApgEIQAeANHISXAL5zZQQhwDk2GWeAtDCLEARpQ4BYAFChIsFDxy44ylarUqWbTt0yKJkqQGMIAO0zMFeOAF55uvAAokDAJRwMd3gSHkKUqTpeAHQA5sQwDhwA9KgAJrEcNEhSquiGABbEIKgAXIgp6nAAjgCuxFC4mFDAJiF5dMRBAPLCAFbEhhEIBYUqubRCQQByJSDC5Q4uVD29cML1gyNjEy4zqq7Tkr1QxOiQZsR53VuzygBMAAwXCyTDo+NQk2sqDDOvkgw0DjtFNDtgABtcG5rAA+fIGE7KYxmeBIVA0YSMGxwH5BUrlXD+KGo4iA3BBTCoGAldAOS4XFyE4gmWIOVBwADUc1WHxcQA).

```typescript
import { FastifyTypeBox, Type } from 'fastify-typebox'
import Fastify                  from 'fastify'

const fastify = Fastify({ }) as FastifyTypeBox

fastify.get('/add', { 
    schema: {
        querystring: Type.Object({
            a: Type.Number(),
            b: Type.Number()
        }),
        response: {
            200: Type.Number()
        }
    }
}, (req, reply) => {

    const { a, b } = req.query

    reply.status(200).send(a + b)
})
```

## Setup

FastifyTypeBox works by reinterpretting Fastify's TypeScript interface. It essentially remaps Fastify's http verb handlers, making them fully TypeBox aware. To enable, just add a `FastifyTypeBox` type assertion after a call to initialize Fastify.

```typescript
import { FastifyTypeBox, Type } from 'fastify-typebox'

import Fastify from 'fastify'

const fastify = Fastify({ ... }) as FastifyTypeBox // Makes Fastify TypeBox aware
```

## Requests

Because FastifyTypeBox operates exclusively on TypeScript type system, users can expect the same request handling behaviour as Fastify. However when enabling FastifyTypeBox, All schemas must be passed as TypeBox types. FastifyTypeBox will automatically infer the correct request parameters without needing to use the TypeBox `Static<TSchema>` type or use generics to specify request / response types in Fastify route handlers.

```typescript
fastify.get('/records', {
    schema: {
        querystring: {
            offset: Type.Interger(),
            limit:  Type.Interger({ maximum: 64 }),
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

## Replies

FastifyTypeBox also provides static type checking of Fastify response types. To achieve this, FastifyTypeBox mandates that users call `status(...)` prior to calling `send(...)`. FastifyTypeBox can narrow the appropriate response type based on the status code. 

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

