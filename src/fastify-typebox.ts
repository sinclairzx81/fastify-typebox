/*--------------------------------------------------------------------------

Fastify TypeBox: Automatic Type Inference for Fastify using TypeBox

The MIT License (MIT)

Copyright (c) 2021 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

export * from '@sinclair/typebox'

import { Static, TSchema, TUnknown } from '@sinclair/typebox'

import { RawServerBase, FastifyRequest, FastifyReply, RouteShorthandOptions, FastifyInstance, RawRequestDefaultExpression, RawReplyDefaultExpression } from 'fastify'

export type FastifyTypeBoxSchema = {
    body?:        TSchema,
    headers?:     TSchema,
    params?:      TSchema,
    querystring?: TSchema,
    response?:    TSchema | { [statusCode: number]: TSchema }
}

export type IntoFastifySchema<T extends FastifyTypeBoxSchema> = {
    Body:        T['body']        extends TSchema ? Static<T['body']>        : unknown,
    Headers:     T['headers']     extends TSchema ? Static<T['headers']>     : unknown,
    Params:      T['params']      extends TSchema ? Static<T['params']>      : unknown,
    Querystring: T['querystring'] extends TSchema ? Static<T['querystring']> : unknown,
}

export type FastifyTypeBoxRequest<
  Schema    extends FastifyTypeBoxSchema,
  RawServer extends RawServerBase,
> = FastifyRequest<
    IntoFastifySchema<Schema>, 
    RawServer, 
    RawRequestDefaultExpression<RawServer>
>

export type FastifyTypeBoxSingleReply<Schema extends TSchema> = Omit<FastifyReply, 'status' | 'send'> & {
    status(status: number): FastifyTypeBoxSingleReply<Schema>
    send(response: Static<Schema>): void
}

export type FastifyTypeBoxMultiReply<Schema extends { [status: string]: TSchema }> = Omit<FastifyReply, 'status' | 'send'> & {
    status<Status extends keyof Schema>(code: Status): FastifyTypeBoxSingleReply<Schema[Status]>
    send(response: never): void
}

export type FastifyTypeBoxResolveReply<T> = 
    T extends TSchema ? FastifyTypeBoxSingleReply<T> :
    T extends { [status: number]: TSchema } ? FastifyTypeBoxMultiReply<T> :
    FastifyTypeBoxSingleReply<TUnknown>

export type FastifyTypeBoxReply<Response extends TSchema | { [status: number]: TSchema} | unknown> = FastifyTypeBoxResolveReply<Response>

export type FastifyTypeBoxRouteShorthandOptions<Server extends RawServerBase, Config> =  Omit<
    RouteShorthandOptions<
        Server,
        RawRequestDefaultExpression<Server>,
        RawReplyDefaultExpression<Server>,
        never,
        Config
>, 'schema'>

export type FastifyTypeBoxRouteOptions<
    Server extends RawServerBase,
    Schema extends FastifyTypeBoxSchema,
    Config
> = FastifyTypeBoxRouteShorthandOptions<Server, Config> & {
    schema?: Schema
}

export type FastifyTypeBoxHandlerMethod<
    RawServer extends RawServerBase, 
    Schema    extends FastifyTypeBoxSchema
> = (
    request: FastifyTypeBoxRequest<Schema, RawServer>, 
    reply:   FastifyTypeBoxReply<Schema['response']>
) => Promise<unknown> | unknown

export type FastifyTypeBoxRouteGenericInterface<Schema extends FastifyTypeBoxSchema> = FastifyTypeBoxRouteOptions<RawServerBase, Schema, any> & {
    method:  string
    url:     string
    handler: FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
}

export type FastifyTypeBox = Omit<FastifyInstance, 'route' | 'all' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put'> & {
    route<Schema extends FastifyTypeBoxSchema>(options: FastifyTypeBoxRouteGenericInterface<Schema>): FastifyTypeBox
    all(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    all<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    delete(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    delete<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    get(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    get<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    head(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    head<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    options(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    options<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    patch(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    patch<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    post(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    post<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
    put(url: string, handler: FastifyTypeBoxHandlerMethod<RawServerBase, {}>): FastifyTypeBox
    put<Schema extends FastifyTypeBoxSchema>(
        url:    string, 
        options: FastifyTypeBoxRouteOptions<RawServerBase, Schema, any>, 
        method:  FastifyTypeBoxHandlerMethod<RawServerBase, Schema>
    ): FastifyTypeBox
}
