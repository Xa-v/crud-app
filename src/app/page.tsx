'use client'
import { useState } from 'react'
import { addItem, deleteItem, updateItem } from '@/app/api/items/route'

export default function Home() {
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [newItem, setNewItem] = useState('')
  const [counter, setCounter] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h1 className='text-xl font-bold mb-4'>CRUD App </h1>
      <input
        type='text'
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className='border p-2 w-full'
        placeholder='Enter item name'
      />
      <button
        onClick={() => addItem(newItem, items, setItems, counter, setCounter)}
        className='mt-2 bg-blue-500 text-white px-4 py-2'
      >
        Add
      </button>
      <ul className='mt-4'>
        {items.map((item) => (
          <li key={item.id} className='flex justify-between p-2 border-b'>
            {editingId === item.id ? (
              <input
                type='text'
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className='border p-1'
              />
            ) : (
              item.name
            )}
            {editingId === item.id ? (
              <button
                onClick={() => {
                  updateItem(item.id, editText, items, setItems)
                  setEditingId(null)
                }}
                className='text-green-500 ml-2'
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(item.id)
                  setEditText(item.name)
                }}
                className='text-yellow-500 ml-2'
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteItem(item.id, items, setItems)}
              className='text-red-500 ml-2'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
