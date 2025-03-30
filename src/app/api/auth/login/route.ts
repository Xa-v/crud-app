import { NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const res = await signIn('credentials', {
    redirect: false,
    email,
    password,
  })

  if (res?.error) {
    return NextResponse.json({ message: res.error }, { status: 401 })
  }

  return NextResponse.json({ message: 'Login successful' }, { status: 200 })
}
