import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  usersThatSharedContent: [],
  sharedContent: [],
  usersThatSharedIncludingItsContent: {},
  overlayPost: null,
}

export const getSharesPerUser = createAsyncThunk(
  'shares-per-user',
  async (query) => {
    let url = `${application.application_url}/mentalExpert/shares-per-user?LoggedExpertId=${query.loggedExpertId}`
    let request = await fetch(url)
    let response = await request.json()

    return response
  }
)

export const createAssignment = createAsyncThunk(
  'give-assignment',
  async (addAssignmentObj) => {
    console.log('New assignment object ', addAssignmentObj)

    let url = `${application.application_url}/mentalExpert/give-assignment`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(addAssignmentObj),
      headers: {
        'Content-Type': 'application/json',
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
      let response =
        action.payload.usersThatSharedIncludingItsContent.serviceResponseObject
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
  },
  extraReducers: (builder) => {
    builder
      //shares-per-user
      .addCase(getSharesPerUser.pending, () => {
        console.log('Pending request for shares per user')
      })
      .addCase(getSharesPerUser.fulfilled, (state, action) => {
        state.usersThatSharedIncludingItsContent = action.payload
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
} = mentalExpertSlice.actions
export default mentalExpertSlice.reducer
