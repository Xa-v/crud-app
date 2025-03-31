import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/user'
import jwt from 'jsonwebtoken'

async function getUserRepository() {
  const db = await getDatabaseConnection()
  return db.getRepository(Users)
}

async function authenticate(req: NextRequest) {
  const cookie = req.cookies.get('next-auth.session-token')
  if (!cookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(cookie.value, process.env.NEXTAUTH_SECRET!)
    return decoded // Return the decoded user session
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}

export async function GET(req: NextRequest) {
  const authError = await authenticate(req)
  if (authError instanceof NextResponse) return authError // If authentication fails, return error response

  try {
    const userRepository = await getUserRepository()
    const users = await userRepository.find()
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const authError = await authenticate(req)
  if (authError instanceof NextResponse) return authError

  try {
    const { name, email } = await req.json()
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const newUser = userRepository.create({ name, email })
    await userRepository.save(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const authError = await authenticate(req)
  if (authError instanceof NextResponse) return authError

  try {
    const { id, name, email } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.name = name || user.name
    user.email = email || user.email
    await userRepository.save(user)

    return NextResponse.json({ message: 'User updated', user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await authenticate(req)
  if (authError instanceof NextResponse) return authError

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const userRepository = await getUserRepository()
    const user = await userRepository.findOne({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await userRepository.remove(user)
    return NextResponse.json({ message: 'User deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
