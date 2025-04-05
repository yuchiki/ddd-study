'use client'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const LoginResponseSchema = z.object({
  token: z.string(),
})

const onSubmit = async ({ username, password }: { username: string, password: string }): Promise<void> => {
  const json = JSON.stringify({ username, password })
  const URL = 'http://localhost:3001/login'
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  }
  const response = await fetch(URL, requestOptions)
    .then(res => res.json())
    .then(res => LoginResponseSchema.safeParse(res))

  if (!response.success) {
    console.log('error:', response.error)
    return
  }

  const token = response.data.token
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)

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
        <Stack spacing={2}>
          <FormControl>
            <TextField id="username" label="ユーザーネーム" {...register('username')} />
            <TextField id="password" label="パスワード" type="password" {...register('password')} />
            <button type="submit">ログイン</button>
          </FormControl>
        </Stack>
      </Box>
    </div>
  )
}
