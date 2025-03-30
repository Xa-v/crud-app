import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // Call NextAuth API manually
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, redirect: false }),
    }
  )

  if (!res.ok) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const data = await res.json()

  return NextResponse.json(
    { message: 'Login successful', token: data.token },
    { status: 200 }
  )
}
