export function formatDateToString(date) {
  const validDate = new Date(date)
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const formattedDate = formatter.format(validDate)
  return formattedDate
}

export function formatStringToDate(date) {
  return new Date(date)
}

export function getSelectedPosts() {
  let postsToShareExport = []
  let postTags = []

  let author = document.querySelector(
    '.list-of-posts-header .list-of-posts-author span'
  ).innerHTML

  let checkedPosts = document.querySelectorAll(
    '.main-container:has(input[name="share-export"]:checked)'
  )

  checkedPosts.forEach((checked) => {
    let postContainerContent = checked.querySelector(
      'a > .post-container > .post-container-content'
    )

    let postTitle =
      postContainerContent.querySelector('.post-header > h1').innerHTML

    let postContent = postContainerContent.querySelector(
      '.post-information > .post-content'
    ).innerHTML

    let postDate = postContainerContent.querySelector(
      '.post-date > p > span'
    ).innerHTML

    let postContainerTags = checked.querySelectorAll(
      '.post-container-tags .add-post-content-picked-tags-span-tag'
    )

    postContainerTags.forEach((tag) => {
      postTags.push(tag.innerHTML)
    })

    let post = {
      title: postTitle,
      user: author,
      content: postContent,
      createdAt: postDate,
      postTags: postTags,
    }

    postsToShareExport.push(post)
    postTags = []
  })

  return postsToShareExport
}