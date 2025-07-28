export function stringIsNullOrEmpty(variable) {
  return variable === null || variable === undefined || variable === ''
}

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
  let postEmotions = []

  let author = document.querySelector(
    '.list-of-posts-header .list-of-posts-author span'
  ).innerHTML

  let checkedPosts = document.querySelectorAll(
    '.main-container:has(input[name="share-export"]:checked)'
  )

  checkedPosts.forEach((checked) => {
    let postContainerContent = checked.querySelector(
      '.post-container > .post-container-content'
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

    let postContainerEmotions = checked.querySelectorAll(
      '.post-container-emotions .post-container-emotion'
    )

    postContainerTags.forEach((tag) => {
      postTags.push(tag.innerHTML)
    })

    postContainerEmotions.forEach((emotion) => {
      let emotionName = emotion.childNodes[0].textContent

      let emotionId = parseInt(
        emotion.querySelector('.post-container-emotion-id').innerHTML
      )
      let emotionToAdd = {
        name: emotionName,
        id: emotionId,
      }
      postEmotions.push(emotionToAdd)
    })

    let post = {
      id: parseInt(id),
      userId: loggedUser.id,
      title: postTitle,
      user: author,
      content: postContent,
      createdAt: postDate,
      tags: postTags,
      emotions: postEmotions,
    }

    postsToShareExport.push(post)
    postTags = []
  })

  return postsToShareExport
}

export function getPeopleToShareContentWith() {
  let peopleToShareIds = []

  let selectedPeopleToShareContentWithContainers = document.querySelectorAll(
    '.person-to-share-with-main-container:has(.person-to-share-content-with-checkbox:checked)'
  )

  selectedPeopleToShareContentWithContainers.forEach((person) => {
    let id = parseInt(person.querySelector('.info-id').value)
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

export const manipulateSidebarAndAdminStatusActions = () => {
  let statusActionsContainer = document.querySelector(
    '.new-experts-status-actions-container'
  )
  let profilesContainer = document.querySelector(
    '.new-experts-main-profiles-container'
  )
  let statusHamburger = document.querySelector('.new-experts-status-hamburger')
  if (window.screen.width <= 500) {
    profilesContainer.style.display = 'flex'
    profilesContainer.style.marginLeft = '0.5rem'
    statusActionsContainer.style.display = 'none'
    statusHamburger.style.display = 'block'
  }

  if (window.screen.width > 500) {
    statusActionsContainer.style.display = 'block'
    statusHamburger.style.display = 'none'
  }
}

export const windowResize = (screenWidth = null, screenHeight = null) => {
  let isInSingleColLayout = false

  window.addEventListener('resize', (e) => {
    let width = e.currentTarget.innerWidth

    manipulateSidebarAndAdminStatusActions()

    if (screenWidth !== null) {
      let mainContainers = document.querySelectorAll('.main-container')
      if (width < screenWidth) {
        mainContainers.forEach((container) => {
          let postContainer = container.querySelector('.post-container')
          let postRevealActionContainers = container.querySelector(
            '.post-reveal-action-containers'
          )
          let postTagsRevealActionContainer =
            postRevealActionContainers.querySelector(
              '.post-tags-reveal-action-container'
            )
          let postOverlay = container.querySelector('.post-overlay')

          if (container.classList.contains('main-single-col')) {
            isInSingleColLayout = true
            container.classList.remove('main-single-col')
            postContainer.classList.remove('post-container-single-col')
            postRevealActionContainers.classList.remove(
              'post-reveal-action-containers-single-col'
            )
            postTagsRevealActionContainer.classList.remove(
              'post-tags-reveal-action-container-single-col'
            )
            postOverlay.classList.remove('post-overlay-single-col')
          }
        })
        return
      }
      if (width >= screenWidth && isInSingleColLayout === true) {
        mainContainers.forEach((container) => {
          let postContainer = container.querySelector('.post-container')
          let postRevealActionContainers = container.querySelector(
            '.post-reveal-action-containers'
          )
          let postTagsRevealActionContainer =
            postRevealActionContainers.querySelector(
              '.post-tags-reveal-action-container'
            )

          let postOverlay = container.querySelector('.post-overlay')

          container.classList.add('main-single-col')
          postContainer.classList.add('post-container-single-col')
          postRevealActionContainers.classList.add(
            'post-reveal-action-containers-single-col'
          )
          postTagsRevealActionContainer.classList.add(
            'post-tags-reveal-action-container-single-col'
          )
          postOverlay.classList.add('post-overlay-single-col')
          isInSingleColLayout = false
        })
        return
      }
      return
    }
    if (screenHeight !== null) {
      //Do something
      return
    }
  })
}

export const checkNewAssignmentValidity = (assignmentRequest) => {
  if (
    assignmentRequest?.assignmentGivenById === undefined ||
    assignmentRequest?.assignmentGivenById <= 0 ||
    assignmentRequest?.assignmentGivenToId === undefined ||
    assignmentRequest?.assignmentGivenToId <= 0 ||
    stringIsNullOrEmpty(assignmentRequest?.content)
  ) {
    return false
  }
  return true
}
