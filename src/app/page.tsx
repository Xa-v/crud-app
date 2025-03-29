'use client'

import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch users
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users.')
    }
    setLoading(false)
  }

  // Create User
  const handleCreate = async () => {
    if (!name || !email) return alert('Name and Email are required!')

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setName('')
      setEmail('')
      fetchUsers()
    } else {
      alert('Failed to create user.')
    }
  }

  // Update User
  const handleUpdate = async (id: number) => {
    const newName = prompt('Enter new name:')
    if (!newName) return

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newName }),
    })

    if (res.ok) {
      fetchUsers()
    } else {
      alert('Failed to update user.')
    }
  }

  // Delete User
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      fetchUsers()
    } else {
      alert('Failed to delete user.')
    }
  }

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>User Management</h1>

      {/* Create User Form */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-2 rounded mr-2'
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border p-2 rounded mr-2'
        />
        <button
          onClick={handleCreate}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Add
        </button>
      </div>

      {/* Display Users */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : users.length > 0 ? (
        <ul className='space-y-2'>
          {users.map((user) => (
            <li
              key={user.id}
              className='border p-2 flex justify-between items-center'
            >
              <div>
                <p className='font-semibold'>{user.name}</p>
                <p className='text-gray-600'>{user.email}</p>
              </div>
              <div>
                <button
                  onClick={() => handleUpdate(user.id)}
                  className='bg-yellow-500 text-white px-2 py-1 rounded mr-2'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className='bg-red-500 text-white px-2 py-1 rounded'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  )
}
