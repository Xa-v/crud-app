import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDatabaseConnection } from '@/app/lib/data-source'
import { Users } from '@/app/lib/entities/user'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const AppDataSource = await getDatabaseConnection()
    const userRepository = AppDataSource.getRepository(Users)

    const users = await userRepository.find()
    console.log('Fetched users from DB:', users)

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
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

    const AppDataSource = await getDatabaseConnection()
    const userRepository = AppDataSource.getRepository(Users)

    const newUser = userRepository.create({ name, email })
    await userRepository.save(newUser)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user', error },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
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

    const AppDataSource = await getDatabaseConnection()
    const userRepository = AppDataSource.getRepository(Users)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.name = name || user.name
    user.email = email || user.email
    await userRepository.save(user)

    return NextResponse.json({ message: 'User updated', user }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
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

    const AppDataSource = await getDatabaseConnection()
    const userRepository = AppDataSource.getRepository(Users)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await userRepository.remove(user)
    return NextResponse.json({ message: 'User deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
