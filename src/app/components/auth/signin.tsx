'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Reset error state

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    alert('Signed in successfully!')
    router.push('/dashboard') // Redirect after successful login
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-80'>
      <input
        type='email'
        placeholder='Email'
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className='p-2 border rounded'
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className='p-2 border rounded'
        required
      />
      {error && <p className='text-red-500'>{error}</p>}
      <button
        type='submit'
        className='p-2 bg-blue-500 text-white rounded cursor-pointer'
      >
        Sign In
      </button>
    </form>
  )
}
