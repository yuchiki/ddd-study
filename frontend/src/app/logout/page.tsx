'use client'

import { useEffect } from 'react'

import { redirect } from 'next/navigation'

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    redirect('/')
  }, [])
}
