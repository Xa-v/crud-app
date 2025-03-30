'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (res?.error) {
      alert('Invalid credentials')
    } else {
      alert('Signed in successfully!')
      router.push('/dashboard') // Redirect to dashboard
    }
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
      <button
        type='submit'
        className='p-2 bg-blue-500 text-white rounded cursor-pointer'
      >
        Sign In
      </button>
    </form>
  )
}
