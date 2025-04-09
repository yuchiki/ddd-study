'use client'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { isLeft } from 'fp-ts/lib/Either'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { PostSignupClient } from '@/api/backendClient'

const onSubmit = async ({ username, password }: { username: string, password: string }): Promise<void> => {
  const client = PostSignupClient
  const response = await client.post({ username: username, password: password })

  if (isLeft(response)) {
    console.log('error:', response.left)
    return
  }

  redirect('/login')
}

type SignupFormInfo = {
  username: string
  password: string
}

export default function Signup() {
  const { register, handleSubmit } = useForm<SignupFormInfo>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  return (
    <div>
      <h1>アカウント新規作成</h1>
      <Box component="form" onSubmit={e => void handleSubmit(onSubmit)(e)}>
        <FormControl>
          <Stack spacing={2}>
            <TextField id="username" label="ユーザーネーム" {...register('username')} />
            <TextField id="password" label="パスワード" type="password" {...register('password')} />
            <button type="submit">新規作成</button>
          </Stack>
        </FormControl>
      </Box>
    </div>
  )
}
