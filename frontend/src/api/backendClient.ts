import { Either, isRight, left } from 'fp-ts/lib/Either'
import { z } from 'zod'

import { AuthInfo, getAuthInfo, setAuthInfo } from '@/authStorage'

import { Client, ClientError } from './jsonClient'

const URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export type BackendClientError = ClientError | { type: 'GetTokenFailedError' }

export class BackendClient {
  private client: Client
  private getAuthInfo?: () => AuthInfo | null
  private setAuthInfo?: (authInfo: AuthInfo) => void

  constructor(path: string, getAuthInfo?: () => AuthInfo | null, setAuthInfo?: (authInfo: AuthInfo) => void) {
    this.client = new Client(`${URL}/${path}`)
    this.getAuthInfo = getAuthInfo
    this.setAuthInfo = setAuthInfo
  }

  async fetch<T extends z.ZodTypeAny>(method: 'GET' | 'POST', json: object, schema: T): Promise<Either<BackendClientError, z.infer<T>>> {
    if (!this.getAuthInfo) {
      return this.client.fetch(method, json, schema)
    }

    const authInfo = this.getAuthInfo()
    if (!authInfo) {
      return left({ type: 'GetTokenFailedError' })
    }

    return this.client.fetch(method, json, schema, authInfo.token)
  }

  async Login(username: string, password: string): Promise<Either<BackendClientError, { token: string }>> {
    const LoginResponseSchema = z.object({
      token: z.string(),
    })

    const result = await this.client.fetch('POST', { username, password }, LoginResponseSchema)

    if (isRight(result)) {
      const token = result.right.token
      if (this.setAuthInfo) {
        this.setAuthInfo({ token, username })
      }
    }

    return result
  }
}

export class GetClient<Schema extends z.ZodTypeAny> {
  private client: Client
  private schema: Schema
  private getAuthInfo?: () => AuthInfo | null

  constructor(path: string, schema: Schema, getAuthInfo?: () => AuthInfo | null) {
    this.client = new Client(`${URL}/${path}`)
    this.schema = schema
    this.getAuthInfo = getAuthInfo
  }

  async get(): Promise<Either<BackendClientError, z.infer<Schema>>> {
    if (!this.getAuthInfo) {
      return this.client.fetch('GET', {}, this.schema)
    }

    const authInfo = this.getAuthInfo()
    if (!authInfo) {
      return left({ type: 'GetTokenFailedError' })
    }

    return this.client.fetch('GET', {}, this.schema, authInfo.token)
  }
}

export class PostClient<Schema extends z.ZodTypeAny> {
  private client: Client
  private schema: Schema
  private getAuthInfo?: () => AuthInfo | null

  constructor(path: string, schema: Schema, getAuthInfo?: () => AuthInfo | null) {
    this.client = new Client(`${URL}/${path}`)
    this.schema = schema
    this.getAuthInfo = getAuthInfo
  }

  async post(body: object): Promise<Either<BackendClientError, z.infer<Schema>>> {
    if (!this.getAuthInfo) {
      return this.client.fetch('POST', body, this.schema)
    }

    const authInfo = this.getAuthInfo()
    if (!authInfo) {
      return left({ type: 'GetTokenFailedError' })
    }

    return this.client.fetch('POST', body, this.schema, authInfo.token)
  }
}

export const LoginClient = new BackendClient('login', undefined, setAuthInfo)
export const PostMessageClient = new PostClient('message', z.unknown(), getAuthInfo)
export const PostSignupClient = new PostClient('signup', z.unknown())
