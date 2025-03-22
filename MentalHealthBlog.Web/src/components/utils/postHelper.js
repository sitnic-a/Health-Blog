export const showTags = (expandIcon) => {
  let postTagsRevealActionMainContainer = expandIcon.parentNode.parentNode

  let postTagsContainer = postTagsRevealActionMainContainer.querySelector(
    '.post-container-tags'
  )
  //   let postTagsMainContainer = postTagsRevealActionMainContainer.querySelector(
  //     '.post-container-main-tags'
  //   )

  if (postTagsContainer.style.height === '') {
    postTagsContainer.style.height = `${postTagsContainer.scrollHeight}px`
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
    postEmotionsContainer.style.opacity = `1`
    expandIcon.style.transform = 'rotate(180deg)'

    return
  }
  postEmotionsContainer.style.height = ''
  postEmotionsContainer.style.opacity = `0`
  expandIcon.style.transform = 'rotate(0deg)'

  return
}
