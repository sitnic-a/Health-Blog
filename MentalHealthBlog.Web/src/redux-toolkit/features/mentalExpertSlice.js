import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'
import { toast } from 'react-toastify'

let initialState = {
  usersThatSharedContent: [],
  sharedContent: [],
  usersThatSharedIncludingItsContent: {},
  overlayPost: null,
}

export const getSharesPerUser = createAsyncThunk(
  'shares-per-user',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/shares-per-user?LoggedExpertId=${objectWithData.query.loggedExpertId}`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()

    return response
  }
)

export const createAssignment = createAsyncThunk(
  'give-assignment',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/give-assignment`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData.addAssignmentObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const mentalExpertSlice = createSlice({
  name: 'mentalExpert',
  initialState,
  reducers: {
    getOnlyUsersThatSharedContent: (state, action) => {
      let response = action.payload.payload.serviceResponseObject
      let usersThatSharedContent = []

      if (response.length > 0) {
        response.map((obj) => {
          let responseUser = obj.userThatSharedContent
          let userThatShared = {
            id: responseUser.id,
            username: responseUser.username,
          }
          usersThatSharedContent.push(userThatShared)
        })
        state.usersThatSharedContent = usersThatSharedContent
      }
    },
    getSharedContentOfPickedUser: (state, action) => {
      let userId = action.payload.userId
      let response = action.payload.usersThatSharedIncludingItsContent
      let pickedObj = response.find(
        (u) => u.userThatSharedContent.id === userId
      )
      state.sharedContent = [...pickedObj.sharedContent]
    },
    setOverlayPost: (state, action) => {
      let contentPost = action.payload
      if (contentPost !== null || contentPost !== undefined) {
        state.overlayPost = contentPost
      }
    },
    resetSharedContent: (state, action) => {
      state.sharedContent = action?.payload
      state.usersThatSharedIncludingItsContent = action?.payload
      state.usersThatSharedContent = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //shares-per-user
      .addCase(getSharesPerUser.pending, () => {
        console.log('Pending request for shares per user')
      })
      .addCase(getSharesPerUser.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode

        if (statusCode === 200) {
          state.usersThatSharedIncludingItsContent =
            action.payload.serviceResponseObject
        }
      })
      .addCase(getSharesPerUser.rejected, (action) => {
        console.log('Request rejected ', action.payload)
      })

      .addCase(createAssignment.pending, (state, action) => {
        console.log('New assignment creation pending... ')
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        console.log('New assignment creation fulfilled ', action.payload)
      })
      .addCase(createAssignment.rejected, (state, action) => {
        console.log('New assignment creation rejected!')
      })
  },
})

export const {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  setOverlayPost,
  resetSharedContent,
} = mentalExpertSlice.actions
export default mentalExpertSlice.reducer
