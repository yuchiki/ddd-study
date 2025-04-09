'use client'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { isLeft } from 'fp-ts/lib/Either'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { LoginClient } from '@/api/backendClient'

const onSubmit = async ({ username, password }: { username: string, password: string }): Promise<void> => {
  const client = LoginClient

  const result = await client.Login(username, password)
  if (isLeft(result)) {
    console.log('error:', result.left)
    return
  }

  redirect('/timeline')
}

type LoginFormInfo = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormInfo>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  return (
    <div>
      <h1>ログイン</h1>

      <Box component="form" onSubmit={e => void handleSubmit(onSubmit)(e)}>
        <FormControl>
          <Stack spacing={2}>
            <TextField id="username" label="ユーザーネーム" {...register('username')} />
            <TextField id="password" label="パスワード" type="password" {...register('password')} />
            <button type="submit">ログイン</button>
          </Stack>
        </FormControl>
      </Box>
    </div>
  )
}
