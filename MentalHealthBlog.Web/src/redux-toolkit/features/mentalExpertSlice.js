import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  dbMentalHealthExperts: [],
  suggestedMentalHealthExperts: [],
  usersThatSharedContent: [],
  sharedContent: [],
  usersThatSharedIncludingItsContent: {},
  overlayPost: null,
}

export const getMentalHealthExperts = createAsyncThunk(
  'experts',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/experts`
    let query
    if (objectWithData !== null && objectWithData !== undefined) {
      query = {
        loggedUserId: objectWithData?.authenticatedUser?.id,
        isFiltering: true,
      }
    }
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

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

      //experts
      .addCase(getMentalHealthExperts.pending, () => {
        console.log('Db experts pending...')
      })
      .addCase(getMentalHealthExperts.fulfilled, (state, action) => {
        state.dbMentalHealthExperts = action.payload.serviceResponseObject
        state.suggestedMentalHealthExperts =
          action.payload.serviceResponseObject

        console.log('Suggested ', state.suggestedMentalHealthExperts)
      })
      .addCase(getMentalHealthExperts.rejected, (state, action) => {
        console.log('Db Experts rejected...')
      })

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
