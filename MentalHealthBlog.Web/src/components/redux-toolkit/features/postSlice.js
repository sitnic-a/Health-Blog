import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { application } from '../../../application'
import { toast } from 'react-toastify'

let initialState = {
  posts: [],
  post: null,
  isLoading: false,
  isSuccessful: false,
  isFailed: false,
  isSharingExporting: false,
}

export const getPosts = createAsyncThunk('post/', async (filteringObject) => {
  let url = `${application.application_url}/post?UserId=${filteringObject.authenticatedUser.id}&MonthOfPostCreation=${filteringObject.monthOfPostCreation}`
  let request = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${filteringObject.authenticatedUser.jwToken}`,
    },
  })
  let response = await request.json()
  return response
})

export const createPost = createAsyncThunk('post/add/', async (addPostObj) => {
  let url = `${application.application_url}/post`
  addPostObj.e.preventDefault()
  let form = new FormData(addPostObj.e.target)
  let data = Object.fromEntries([...form.entries()])

  let newPost = {
    title: data.title,
    content: data.content,
    userId: addPostObj.authenticatedUser.id,
    tags: addPostObj.chosenTags,
    emotions: addPostObj.chosenEmotions,
  }

  let request = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let response = await request.json()
  return response
})

export const updatePost = createAsyncThunk(
  'post/update/{id}',
  async (updatePostObj) => {
    console.log('Update post obj ', updatePostObj)
    updatePostObj.e.preventDefault()
    let form = new FormData(updatePostObj.e.target)
    let formEntries = [...form.entries()]
    let formObject = Object.fromEntries(formEntries)
    let data = {
      title: formObject.title,
      content: formObject.content,
      userId: updatePostObj.post.userId,
    }

    console.log(data)
    if (
      data.title === '' ||
      data.title === null ||
      data.content === '' ||
      data.content === null
    ) {
      toast.error('Fields should be populated!', {
        autoClose: 1500,
        position: 'bottom-right',
      })
      return
    }

    let url = `${application.application_url}/post/${updatePostObj.post.id}`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${updatePostObj.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const deletePostById = createAsyncThunk(
  'post/delete/{id}',
  async (deletePostObj) => {
    let url = `${application.application_url}/post/${deletePostObj.post.id}`
    let request = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${deletePostObj.loggedUser.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

let postSlice = createSlice({
  name: 'postSlice',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload
    },
    setIsSharingExporting: (state, action) => {
      state.isSharingExporting = action.payload
    },
    showTags: (state, action) => {
      let postTagsRevealActionMainContainer =
        action.payload.currentTarget.parentNode.parentNode

      let postTagsContainer = postTagsRevealActionMainContainer.querySelector(
        '.post-container-tags'
      )
      if (postTagsContainer.style.height === '') {
        postTagsContainer.style.height = `${postTagsContainer.scrollHeight}px`
        postTagsContainer.style.opacity = `1`
        action.payload.currentTarget.style.transform = 'rotate(180deg)'

        return
      }
      postTagsContainer.style.height = ''
      postTagsContainer.style.opacity = `0`
      action.payload.currentTarget.style.transform = 'rotate(0deg)'

      return
    },
    showEmotions: (state, action) => {
      let postEmotionsRevealActionMainContainer =
        action.payload.currentTarget.parentNode.parentNode

      let postEmotionsContainer =
        postEmotionsRevealActionMainContainer.querySelector(
          '.post-container-emotions'
        )
      if (postEmotionsContainer.style.height === '') {
        postEmotionsContainer.style.height = `${postEmotionsContainer.scrollHeight}px`
        postEmotionsContainer.style.opacity = `1`
        action.payload.currentTarget.style.transform = 'rotate(180deg)'

        return
      }
      postEmotionsContainer.style.height = ''
      postEmotionsContainer.style.opacity = `0`
      action.payload.currentTarget.style.transform = 'rotate(0deg)'

      return
    },
  },
  extraReducers: (builder) => {
    builder
      //--- getPosts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPosts.rejected, (state) => {
        state.isFailed = true
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.serviceResponseObject
      })

      //--- addPost
      .addCase(createPost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createPost.rejected, (state) => {
        state.isFailed = true
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false
        let statusCode = action.payload.statusCode

        if (statusCode === 201) {
          toast.success('Succesfully added post', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          return
        }

        if (statusCode !== 200 || statusCode !== 201) {
          toast.error('Fields should be populated!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }
      })

      //--- updatePost
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePost.rejected, (state) => {
        state.isFailed = true
        toast.error("Couldn't update post", {
          autoClose: 1500,
          position: 'bottom-right',
        })
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        toast.success('Succesfully updated post', {
          autoClose: 1500,
          position: 'bottom-right',
        })
        toast.done = () => {
          window.location.reload()
        }
      })

      //--- deleteById
      .addCase(deletePostById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePostById.rejected, (state) => {
        state.isFailed = true
        toast.error("Couldn't delete post", {
          autoClose: 5000,
          position: 'bottom-right',
        })
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        toast.isActive = false
      })
  },
})

export const { setPost, setIsSharingExporting, showTags, showEmotions } =
  postSlice.actions

export default postSlice.reducer
