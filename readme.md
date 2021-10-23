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

## Example

The following example demonstrates general usage. TypeScript Playgound link [here](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgFQJ5gKYBo4DECGAzjMAGapqYBCEAHnAL5ylQQhwDkpRJ5AtDHQYARnQ4BYAFChIsPDzKo4ylarUqWbTt2KKJkqQHpDcPmfMXLV6zdt2rRkwFEAdvmEAbDCiE16AYzYwfBJhYA9gQUdTe1i4+LspKUCXYmYFcjgAXnldcgAKJAYASjgiXN4KXzokyWMYhMam+2iAEQxSYBdvAjylAGV-AAsMEHw4AHdIoZ9qGrqTZqXli1qUtMJh0fGchClVUQATVAAuWYwAOgB5YQArDH8YQv31OG3ws8pL-pgoLoBzQrMaBjGBnDjvDwcEovZQlLCwuBQDCESCpDBnPaSV5wABMAAZ8Z8hNc7g8nlicapaMTMBcAHIAVxAwgwUHyxQR2KpylO5wZzNZ7OKiNUMO5cKkDFq9RWcuabQ6XW8ACUIIyYBhovKdfFajpKhdIMR8hxDBwcEhNiMxowcPlkQBHHDIsAeVClLIAPkQiMR9UhcGAhDgxD+Ln+iPW8CQgaYOSdFyOqFqqnqxBCjJDBPxSJRaMI3gzJH8+A87rgW38AGsMIcLojXe6LsWs-kc8UWxgXIcgTS4ABGHB83GMUpS4pAA).

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

FastifyTypeBox works by reinterpretting Fastify's TypeScript interface. It remaps Fastify's http verb handlers (`get()`, 'post()`, etc), making them TypeBox aware. To enable, just add a `FastifyTypeBox` type assertion after a call to initialize Fastify.

```typescript
import { FastifyTypeBox, Type } from 'fastify-typebox'

import Fastify                  from 'fastify'

const fastify = Fastify({ ... }) as FastifyTypeBox // Makes Fastify TypeBox aware
```

## Requests

FastifyTypeBox operates entirely on the TypeScript type system, so users can expect the same request handling behaviour as Fastify. However when enabling FastifyTypeBox, schemas must be passed as TypeBox types. FastifyTypeBox will automatically infer the correct request parameters without needing to use the TypeBox `Static<TSchema>` type or use generics to specify request / response types in Fastify route handlers.

```typescript
fastify.get('/records', {
    schema: {
        querystring: {
            offset: Type.Interger(),
            limit:  Type.Interger({ maximum: 64 }),
        },
        response: {
            200: Type.Array(Type.Object({
                id:    Type.String({format: 'uuid' })
                name:  Type.String(),
                email: Type.String({format: 'email' })
            }))
        }
    }
}, async (request, reply) => {
    reply.status(200).send(await get(
        request.query.offset, 
        request.query.limit
    ))
})
```

## Responses

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

