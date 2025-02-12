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

export function returnSharePerMentalHealthExpertRecentShareBasicInfoElements(
  e
) {
  let spanContainer = e.currentTarget.parentNode
  let shrinkAction = spanContainer.children.item(0)
  let expandAction = spanContainer.children.item(1)
  let recentShareContainer = e.currentTarget.parentNode.parentNode.parentNode

  let basicInfoContainer = recentShareContainer.children.item(1)

  return {
    spanContainer,
    shrinkAction,
    expandAction,
    recentShareContainer,
    basicInfoContainer,
  }
}

export function formatStringToDate(date) {
  return new Date(date)
}

export function getSelectedPosts(loggedUser) {
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

    let id = postContainerContent.querySelector('input[data-post-id]').dataset
      .postId

    let postTitle =
      postContainerContent.querySelector('.post-header > h1').innerHTML

    let postContent = postContainerContent.querySelector(
      '.post-information > .post-content'
    ).innerHTML

    let postDateString = postContainerContent.querySelector(
      '.post-date > p > span'
    ).innerHTML

    let postDate = new Date(postDateString)

    let postContainerTags = checked.querySelectorAll(
      '.post-container-tags .add-post-content-picked-tags-span-tag'
    )

    postContainerTags.forEach((tag) => {
      postTags.push(tag.innerHTML)
    })

    let post = {
      id: parseInt(id),
      userId: loggedUser.id,
      title: postTitle,
      user: author,
      content: postContent,
      createdAt: postDate,
      tags: postTags,
    }

    postsToShareExport.push(post)
    postTags = []
  })

  return postsToShareExport
}

export function getPeopleToShareContentWith() {
  let peopleToShareIds = []

  let selectedPeopleToShareContentWithContainers = document.querySelectorAll(
    '.person-to-give-permission-container:has(.permission-action > input[name="person-to-give-permission-checkbox"]:checked)'
  )

  selectedPeopleToShareContentWithContainers.forEach((person) => {
    let permissionInformation = person.querySelector(
      '.person-to-give-permission-information'
    )
    let basicInformation = permissionInformation.querySelector(
      '.person-to-give-permission-basic-information'
    )

    let id = parseInt(basicInformation.querySelector('.info-id').value)

    peopleToShareIds.push(id)
  })
  return peopleToShareIds
}

export function prepareContentToShare(paramsForPreparation) {
  let postsToExport = paramsForPreparation.postsToExport
  let shareLink = paramsForPreparation.shareLink

  let postsToShareIds = postsToExport.map((post) => post.id)
  let shareContentWithIds = getPeopleToShareContentWith()

  let contentToBeShared = {
    postIds: postsToShareIds,
    sharedWithIds: shareContentWithIds,
    sharedAt: new Date(),
    shareLink: shareLink,
  }

  console.log('Content ', contentToBeShared)

  return contentToBeShared
}

export function base64ToArrayBuffer(data) {
  var binaryString = window.atob(data)
  var binaryLen = binaryString.length
  var bytes = new Uint8Array(binaryLen)
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

export function previewImage(photo) {
  let displayPhotoContainer = document.getElementById(
    'mental-health-expert-register-photo-main-container'
  )
  if (photo) {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(photo)
    fileReader.addEventListener('load', function () {
      displayPhotoContainer.innerHTML = '<img src="' + this.result + '" />'
    })
  }
}

export function expandShrinkSidebar() {
  let mainUsersContainer = document.querySelector(
    '.sharing-users-main-users-container'
  )
  let usersContainer = document.querySelectorAll('.sharing-user-user-container')
  let usersTitle = document.querySelectorAll('.sharing-user-title')
  let contentContainer = document.querySelector(
    '.sharing-users-content-container'
  )

  mainUsersContainer.classList.toggle(
    'sharing-users-main-users-container-expanded'
  )
  usersContainer.forEach((user) => {
    user.classList.toggle('sharing-user-user-container-expanded')
  })
  usersTitle.forEach((user) => {
    user.classList.toggle('sharing-user-title-expanded')
  })

  if (contentContainer !== null) {
    contentContainer.classList.toggle(
      'sharing-users-content-container-shrinked'
    )
  }
}
