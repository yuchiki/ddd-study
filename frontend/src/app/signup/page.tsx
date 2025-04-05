'use client'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'

const onSubmit = async ({ username, password }: { username: string, password: string }): Promise<void> => {
  const json = JSON.stringify({ username, password })
  const URL = 'http://localhost:3001/signup'
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  }
  const response = await fetch(URL, requestOptions)

  if (!response.ok) {
    console.log('error:', response.status)
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
        <Stack spacing={2}>
          <FormControl>
            <TextField id="username" label="ユーザーネーム" {...register('username')} />
            <TextField id="password" label="パスワード" type="password" {...register('password')} />
            <button type="submit">新規作成</button>
          </FormControl>
        </Stack>
      </Box>
    </div>
  )
}
