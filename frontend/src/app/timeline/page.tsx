'use client'
import { useEffect, useState } from 'react'

import { Box, FormControl, Stack, TextField } from '@mui/material'
import { Either, isLeft, match } from 'fp-ts/lib/Either'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { io } from 'socket.io-client'

import { PostMessageClient } from '@/api/backendClient'
import { resetLoginStatus, getAuthInfo } from '@/authStorage'

import styles from './page.module.css'

const onSubmit = (reset: () => void): ({ message }: { message: string }) => Promise<void> => {
  return async ({ message }: { message: string }) => {
    const client = PostMessageClient
    const result = await client.post({ content: message })

    if (isLeft(result)) {
      switch (result.left.type) {
        case 'UnAuthorizedError':
          console.log('error:', result.left)
          resetLoginStatus()
          redirect('/login')
        // eslint-disable-next-line no-fallthrough
        default:
          console.log('error:', result.left)
          return
      }
    }

    reset()
  }
}

type Post = { id: string, userId: string, content: string, createdAt: Date, user: { id: string, username: string } }

function EditingMessageForm() {
  const { register, handleSubmit, reset } = useForm<{ message: string }>({
    defaultValues: {
      message: '',
    },
  })

  return (
    <Box component="form" onSubmit={e => void handleSubmit(onSubmit(reset))(e)}>
      <FormControl>
        <Stack spacing={2}>
          <TextField id="message" {...register('message')} />
          <button type="submit">送信</button>
        </Stack>
      </FormControl>
    </Box>
  )
}

export default function Timeline() {
  const [, setIsConnected] = useState(false)
  const [, setTransport] = useState('N/A')
  const [posts, setPosts] = useState<Post[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [, setToken] = useState<string | null>(null)

  useEffect(() => {
    const authInfo = getAuthInfo()

    if (!authInfo) {
      redirect('/login')
    }

    setUsername(authInfo.username)
    setToken(authInfo.token)

    const URL = 'http://localhost:3001'
    const socket = io(URL)

    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true)
      const transportName = socket.io.engine.transport.name
      setTransport(transportName)
      console.log(transportName)

      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name)
      })
    }

    function onDisconnect() {
      setIsConnected(false)
      setTransport('N/A')
    }

    socket.on('connect', onConnect)
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
    socket.on('disconnect', onDisconnect)
    socket.on('timelineListener', (posts: Either<unknown, Post[]>) => {
      match(
        () => {
          console.log('Error: ')
        },
        (posts: Post[]) => {
          setPosts(posts)
        },
      )(posts)
    })

    return () => {
      if (socket.connected) {
        socket.close()
      }
    }
  }, [])

  return (
    <div className={styles.posts}>
      <h2>
        {username}
        &apos;s Timeline
      </h2>
      <EditingMessageForm />
      <div>
        <ul>
          {posts.toReversed().map(post => (
            <li key={post.id}>
              <h2>
                @
                {post.user.username}
                {' '}
                in
                {new Date(post.createdAt).toLocaleString()}
              </h2>
              <p>{post.content}</p>
            </li>
          ),
          )}
        </ul>
      </div>
    </div>
  )
}
