'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from '../components/logout'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(() => null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Try 'include' if 'same-origin' doesn't work
          headers: { 'Content-Type': 'application/json' },
        })

        const text = await res.text()
        console.log('Raw API Response:', text)

        if (!res.ok) {
          console.error('API Error:', res.status)
          router.push('/')
          return
        }

        const data = JSON.parse(text)
        console.log('Parsed API Data:', data)

        setUser(data.user || data)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  console.log('Rendered user:', user)

  if (loading) return <p>Loading...</p>
  if (!user) return <p>Fetching user...</p>

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold'>Welcome to Dashboard</h1>
      <p className='mt-2'>Hello, {user?.email || 'Guest'}!</p>
      <div className='flex gap-2'>
        <button
          onClick={() => router.push('/crud')}
          className='bg-white text-black cursor-pointer p-2 rounded mt-5 text-sm'
        >
          Go to Users
        </button>
        <LogoutButton />
      </div>
    </div>
  )
}
