const storage = sessionStorage

export const getItem = (key, defaultValue) => {
  try {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}

export const removeItem = (key) => {
  try {
    storage.removeItem(key)
  } catch {
    return
  }
}

export const clearStorage = () => {
  storage.clear()
}
