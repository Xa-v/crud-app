export function addItem(
  newItem: string,
  items: { id: number; name: string }[],
  setItems: Function,
  counter: number,
  setCounter: Function
) {
  if (!newItem) return
  const newEntry = { id: counter, name: newItem }
  setItems([...items, newEntry])
  setCounter(counter + 1)
}

export function deleteItem(
  id: number,
  items: { id: number; name: string }[],
  setItems: Function
) {
  setItems(items.filter((item) => item.id !== id))
}

export function updateItem(
  id: number,
  newName: string,
  items: { id: number; name: string }[],
  setItems: Function
) {
  setItems(
    items.map((item) => (item.id === id ? { ...item, name: newName } : item))
  )
}
