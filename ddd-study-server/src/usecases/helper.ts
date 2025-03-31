import { Either } from 'fp-ts/lib/Either'

export type UseCaseResponse<E, R> = Either<E, R>
