const storage = localStorage

export const getItem = (key, defaultValue) => {
  try {
    const value = storage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

export const getItemWithTTL = (key, defaultValue) => {
  try {
    const value = storage.getItem(key)
    const now = new Date()

    if (!value) return defaultValue

    const item = JSON.parse(value)

    if (now.getDate() > item.expire) {
      storage.removeItem(key)
      return defaultValue
    }
    
    return item.value
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

export const setItemWithTTL = (key, value, ttl_ms) => {
  try {
    const item = {
      value,
      expire: Date.now() + ttl_ms
    }
    storage.setItem(key, JSON.stringify(item))
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
