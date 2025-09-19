import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { application } from '../../application'
import { toast } from 'react-toastify'
import {
  checkInputDataValidity,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'

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

export const getById = createAsyncThunk('post/id', async (requestObject) => {
  let url = `${application.application_url}/post/${requestObject.postId}`

  let request = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requestObject.authenticatedUser.jwToken}`,
    },
  })
  let response = await request.json()
  return response
})

export const createPost = createAsyncThunk(
  'post/add/',
  async (objectWithData) => {
    let url = `${application.application_url}/post`

    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const updatePost = createAsyncThunk(
  'post/update/{id}',
  async (updatePostObj) => {
    updatePostObj.e.preventDefault()

    let form = new FormData(updatePostObj.e.target)
    let formEntries = [...form.entries()]
    let formObject = Object.fromEntries(formEntries)

    let data = {
      title: formObject.title,
      content: formObject.content,
      userId: updatePostObj.post.userId,
    }

    if (stringIsNullOrEmpty(data.title) || stringIsNullOrEmpty(data.content)) {
      toast.error('Populate all fields!', {
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
        Authorization: `Bearer ${deletePostObj.authenticatedUser.jwToken}`,
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
      let postOverlays = document.querySelectorAll('.post-overlay')
      let shareExportCheckboxes = document.querySelectorAll(
        'input[name="share-export"]'
      )
      if (state.isSharingExporting === true) {
        postOverlays.forEach((overlay) => {
          overlay.style.visibility = 'visible'
        })
        shareExportCheckboxes.forEach((shareExportCheckbox) => {
          shareExportCheckbox.style.visibility = 'visible'
        })
        return
      }
      postOverlays.forEach((overlay) => {
        overlay.style.visibility = 'hidden'
      })
      shareExportCheckboxes.forEach((shareExportCheckbox) => {
        shareExportCheckbox.style.visibility = 'hidden'
      })
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

      //--- getById
      .addCase(getById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getById.fulfilled, (state, action) => {
        state.isLoading = false
        state.post = action.payload.serviceResponseObject
      })
      .addCase(getById.rejected, (state, action) => {
        state.isLoading = false
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
        let statusCode = action?.payload?.statusCode

        if (statusCode === 201) {
          toast.success('Uspješno kreiran post!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          return
        }
      })

      //--- updatePost
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePost.rejected, (state) => {
        state.isFailed = true
        toast.error('Radnja nije uspješno izvršena!', {
          autoClose: 3000,
          position: 'bottom-right',
        })
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          toast.success('Uspješno ste uredili post', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          toast.done = () => {
            window.location.reload()
          }
        }
      })

      //--- deleteById
      .addCase(deletePostById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePostById.rejected, (state) => {
        state.isFailed = true
        toast.error('Radnja nije uspješno izvršena', {
          autoClose: 3000,
          position: 'bottom-right',
        })
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        toast.isActive = false
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          toast.success('Uspješno ste obrisali post', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        }
      })
  },
})

export const { setPost, setIsSharingExporting } = postSlice.actions

export default postSlice.reducer
