export const showTags = (expandIcon) => {
  let postTagsRevealActionMainContainer = expandIcon.parentNode.parentNode

  let postTagsContainer = postTagsRevealActionMainContainer.querySelector(
    '.post-container-tags'
  )

  if (postTagsContainer.style.height === '') {
    postTagsContainer.style.height = `${postTagsContainer.scrollHeight}px`
    postTagsContainer.style.maxHeight = `200px`
    let height = parseInt(postTagsContainer.style.height)
    if (height > '200') {
      postTagsContainer.style.overflowY = 'scroll'
    }
    postTagsContainer.style.opacity = `1`
    expandIcon.style.transform = 'rotate(180deg)'

    return
  }
  postTagsContainer.style.height = ''
  postTagsContainer.style.opacity = `0`
  expandIcon.style.transform = 'rotate(0deg)'

  return
}

export const showEmotions = (expandIcon) => {
  let postEmotionsRevealActionMainContainer = expandIcon.parentNode.parentNode

  let postEmotionsContainer =
    postEmotionsRevealActionMainContainer.querySelector(
      '.post-container-emotions'
    )

  if (postEmotionsContainer.style.height === '') {
    postEmotionsContainer.style.height = `${postEmotionsContainer.scrollHeight}px`
    postEmotionsContainer.style.maxHeight = `200px`
    let height = parseInt(postEmotionsContainer.style.height)
    if (height > '200') {
      postEmotionsContainer.style.overflowY = 'scroll'
    }
    postEmotionsContainer.style.opacity = `1`
    expandIcon.style.transform = 'rotate(180deg)'

    return
  }
  postEmotionsContainer.style.height = ''
  postEmotionsContainer.style.opacity = `0`
  expandIcon.style.transform = 'rotate(0deg)'

  return
}

export const rotateElements = (element) => {
  console.log('Element ', element)

  console.log('After rotation ', typeof element)

  console.log('In obj')

  let layoutPickerTypes = element.target.parentNode
  let clickedElement = element.target
  let index = Array.from(layoutPickerTypes.children).indexOf(clickedElement)

  let temp = layoutPickerTypes.children[0].outerHTML
  layoutPickerTypes.children[0].outerHTML =
    layoutPickerTypes.children[index].outerHTML

  layoutPickerTypes.children[index].outerHTML = temp
  Array.from(layoutPickerTypes.children).forEach((type) => {
    type.addEventListener('click', (e) => {
      let clickedElement = e.target.parentNode
      rotateElements(clickedElement)
      return
    })
  })
}
