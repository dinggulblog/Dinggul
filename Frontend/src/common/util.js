export const debounce = (callback, limit = 300) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => { callback.apply(this, args) }, limit)
  }
}

export const throttle = (callback, limit = 300) => {
  let waiting = false
  return function () {
    if (!waiting) {
      callback.apply(this, arguments)
      waiting = true
      setTimeout(() => { waiting = false }, limit)
    }
  }
}

export const searchParentComment = (parentComment, parentId = null) => {
  const { _id, childComments } = parentComment
        
  if (_id === parentId) {
    return parentComment
  }
  else if (Array.isArray(childComments)) {
    let result = null
    childComments.forEach(childComment => result = searchParentComment(childComment, parentId))
    return result
  }

  return null
}

export const resizeTextarea = (e) => {
  e.target.style.height = ''
  e.target.style.height = e.target.scrollHeight + 'px'
}

export const closeDropdowns = (event) => {
  if (!event.target.matches('.btn_dropbox > svg') && !event.target.matches('.btn_dropbox > svg > path')) {
    const dropdowns = document.body.getElementsByClassName('wrap_dropbox_items')
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show')
    }
  }
}

export const closeBottomSheets = (event) => {
  if (!event.target.matches('.btn_dropbox > svg') && !event.target.matches('.btn_dropbox > svg > path')) {
    const bottomSheets = document.body.getElementsByClassName('bottom-sheet')
    for (let i = 0; i < bottomSheets.length; i++) {
      bottomSheets[i].classList.remove('show')
    }
  }
}