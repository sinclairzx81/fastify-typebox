/*--------------------------------------------------------------------------

Fastify TypeBox: Enhanced TypeBox support for Fastify

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
export * from 'fastify'

import { Static, TSchema, TUnknown } from '@sinclair/typebox'

import Fastify, { FastifyServerOptions, RawServerBase, FastifyRequest, FastifyReply, RouteShorthandOptions, FastifyInstance, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyRegisterOptions } from 'fastify'

// --------------------------------------------------------------------------
// Fastify Interface Mapping
// --------------------------------------------------------------------------

export type FastifyTypeBoxSchema = {
    body?:        TSchema,
    headers?:     TSchema,
    querystring?: TSchema,
    response?:    { [statusCode: number]: TSchema }
}

export type IntoFastifySchema<Url extends string, T extends FastifyTypeBoxSchema> = {
    Body:        T['body']        extends TSchema ? Static<T['body']>        : unknown,
    Headers:     T['headers']     extends TSchema ? Static<T['headers']>     : unknown,
    Querystring: T['querystring'] extends TSchema ? Static<T['querystring']> : unknown,
    Params:      FastifyTypeBoxParseParams<Url>
}

export type FastifyTypeBoxRequest<
    Server extends RawServerBase,  
    Schema extends FastifyTypeBoxSchema,
    Url    extends string,
> = FastifyRequest<
    IntoFastifySchema<Url, Schema>, 
    Server, 
    RawRequestDefaultExpression<Server>
>

export type FastifyTypeBoxResolvedReply<Schema extends TSchema> = Omit<FastifyReply, 'status' | 'send'> & {
    status(status: number): FastifyTypeBoxResolvedReply<Schema>
    send(response: Static<Schema>): void
}

export type FastifyTypeBoxUnresolvedReply<Schema extends { [status: string]: TSchema }> = Omit<FastifyReply, 'status' | 'send'> & {
    /** You must call status() before calling send() */
    send(response: never): void
    status<Status extends keyof Schema>(code: Status): FastifyTypeBoxResolvedReply<Schema[Status]>    
}

export type FastifyTypeBoxResolveReply<T> = 
    T extends { [status: number]: TSchema } ? FastifyTypeBoxUnresolvedReply<T> :
    FastifyTypeBoxResolvedReply<TUnknown>

export type FastifyTypeBoxReply<Response extends { [status: number]: TSchema} | unknown> = FastifyTypeBoxResolveReply<Response>

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
    Server extends RawServerBase, 
    Schema extends FastifyTypeBoxSchema,
    Url    extends string
> = (
    request: FastifyTypeBoxRequest<Server, Schema, Url>, 
    reply:   FastifyTypeBoxReply<Schema['response']>
) => Promise<unknown> | unknown

export type FastifyTypeBoxRouteGenericInterface<
    Server extends RawServerBase,
    Schema extends FastifyTypeBoxSchema,
    Url    extends string
> = FastifyTypeBoxRouteOptions<Server, Schema, any> & {
    method:  string
    url:     string
    handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
}

export type FastifyTypeBoxPluginCallback<
    Server extends RawServerBase,
    Options extends Record<never, never>
> = (
    instance: FastifyTypeBoxInstance<Server>,
    opts:    Options,
    done: (err?: Error) => void
) => void

export type FastifyTypeBoxInstance<Server extends RawServerBase = RawServerBase> = Omit<FastifyInstance, 'register' | 'route' | 'all' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put'> & {
    
    register<Options>(plugin: FastifyTypeBoxPluginCallback<Server, Options>, opts?: FastifyRegisterOptions<Options> | undefined): FastifyTypeBoxInstance
    
    route<Url extends string, Schema extends FastifyTypeBoxSchema>(options: FastifyTypeBoxRouteGenericInterface<Server, Schema, Url>): FastifyTypeBoxInstance
    
    all<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    all<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    delete<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    delete<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    get<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    get<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url,
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    head<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    head<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    options<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    options<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    patch<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    patch<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    post<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    post<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
    
    put<Url extends string>(url: Url, handler: FastifyTypeBoxHandlerMethod<Server, {}, Url>): FastifyTypeBoxInstance
    put<Url extends string, Schema extends FastifyTypeBoxSchema>(
        url:     Url, 
        options: FastifyTypeBoxRouteOptions<Server, Schema, any>, 
        handler: FastifyTypeBoxHandlerMethod<Server, Schema, Url>
    ): FastifyTypeBoxInstance
}

// --------------------------------------------------------------------------
// Interface
// --------------------------------------------------------------------------

export default function FastifyTypeBox(options?: FastifyServerOptions) {
    return Fastify(options) as FastifyTypeBoxInstance<RawServerBase>
}

// --------------------------------------------------------------------------
// Param Parsing
// --------------------------------------------------------------------------

export type FastifyTypeBoxExtractParams<S extends string, Params extends string[]> = 
    S extends `/${infer R}`            ? FastifyTypeBoxExtractParams<R, Params>         : // forward /
    S extends `:${infer P}/${infer R}` ? FastifyTypeBoxExtractParams<R, [...Params, P]> : // inner param
    S extends `:${infer P}`            ? [...Params, P]                                 : // final param
    S extends `${infer _}/${infer R}`  ? FastifyTypeBoxExtractParams<R, Params>         : // component
    Params

export type FastifyTypeBoxUnionParameters <T extends string[]> = {[K in keyof T]: T[K]}[number]

export type FastifyTypeBoxIntoParamsObject<T extends string> = { [K in T]: string }

export type FastifyTypeBoxParseParams<S extends string> =  FastifyTypeBoxIntoParamsObject<
    FastifyTypeBoxUnionParameters<FastifyTypeBoxExtractParams<S, []>>
>






