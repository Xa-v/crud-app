import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/user'

async function getUserRepository() {
  const db = await getDatabaseConnection()
  return db.getRepository(Users)
}

// ✅ Fetch session from api/auth/session folder
async function getSession(req: NextRequest) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    method: 'GET',
    headers: { cookie: req.headers.get('cookie') || '' },
  })

  if (!res.ok) return null
  return res.json()
}

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
  const session = await getSession(req)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

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
