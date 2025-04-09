import { Either, left, right } from 'fp-ts/lib/Either'
import { z } from 'zod'

type FetchNotOkError = {
  type: 'FetchNotOkError'
  status: number
  body: string
}

type UnAuthorizedError = {
  type: 'UnAuthorizedError'
  status: number
}

type ZodError = {
  type: 'ZodError'
  error: z.ZodError
}

export type ClientError = FetchNotOkError | UnAuthorizedError | ZodError

export class Client {
  constructor(private baseUrl: string) {}

  async fetch<T extends z.ZodTypeAny>(method: 'GET' | 'POST', json: object, schema: T, token?: string): Promise<Either<ClientError, z.infer<T>>> {
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(json),
    }

    const response = await fetch(this.baseUrl, requestOptions)
    if (!response.ok) {
      if (response.status === 401) {
        return left({
          type: 'UnAuthorizedError',
          status: response.status,
        })
      }

      const body = await response.text()
      return left({
        type: 'FetchNotOkError',
        status: response.status,
        body,
      })
    }

    const result = await response.json().then(res => schema.safeParse(res))

    if (!result.success) {
      return left({
        type: 'ZodError',
        error: result.error,
      })
    }

    return right(result.data)
  }
}
