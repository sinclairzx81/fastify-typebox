<div align='center'>

<h1>Fastify-TypeBox</h1>

<p>Automatic Type Inference for Fastify using TypeBox</p>

[![npm version](https://badge.fury.io/js/fastify-typebox.svg)](https://badge.fury.io/js/fastify-typebox)

</div>

## Install

```bash
$ npm install fastify-typebox
```

## Overview

Fastify-TypeBox is a specialized TypeBox compatibility layer for Fastify. It enables TypeBox schemas to be automatically type inferenced inside Fastify route handlers with no additional type hinting. The compatibility layer itself is implemented entirely in the TypeScript type system.

License MIT

## Example

```typescript
import { Type, FastifyTypeBox } from 'fastify-typebox'
import Fastify                  from 'fastify'

// -------------------------------------------------------------
// Enable TypeBox compatibility
// -------------------------------------------------------------

const fastify = Fastify({ }) as FastifyTypeBox

// -------------------------------------------------------------
// Define Fastify Schema with TypeBox
// -------------------------------------------------------------

const schema = {
    body: Type.Object({
        email:    Type.String({ format: 'email'}),
        username: Type.String(),
        count:    Type.Integer()
    }),
    response: {
        200: Type.Object({
            x: Type.Number(),
            y: Type.Number()
        })
    }
}

// -------------------------------------------------------------
// Define Route
// -------------------------------------------------------------

fastify.post('/', { schema }, (req, reply) => {

    const { email, username, count } = req.body // { email: string, username: string, count: number }

    reply.status(200).send({ x: 1, y: 2 })      // { x: number, y: number }
})
```

