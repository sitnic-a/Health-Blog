import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  usersThatSharedContent: [],
  sharedContent: [],
  usersThatSharedIncludingItsContent: {},
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

export const mentalExpertSlice = createSlice({
  name: 'mentalExpert',
  initialState,
  reducers: {
    getOnlyUsersThatSharedContent: (state, action) => {
      let response = action.payload.payload.serviceResponseObject
      let usersThatSharedContent = []

      response.map((obj) => {
        let responseUser = obj.userThatSharedContent
        let userThatShared = {
          id: responseUser.id,
          username: responseUser.username,
        }
        usersThatSharedContent.push(userThatShared)
      })
      state.usersThatSharedContent = usersThatSharedContent
    },
  },
  extraReducers: (builder) => {
    //shares-per-user
    builder
      .addCase(getSharesPerUser.pending, () => {
        console.log('Pending request for shares per user')
      })
      .addCase(getSharesPerUser.fulfilled, (state, action) => {
        state.usersThatSharedIncludingItsContent = action.payload
        console.log('Response ', state.usersThatSharedIncludingItsContent)

        // let response = action.payload.serviceResponseObject
        // let usersThatSharedContent = []
        // response.map((obj) => {
        //   let responseUser = obj.userThatSharedContent

        //   let userThatShared = {
        //     id: responseUser.id,
        //     username: responseUser.username,
        //   }
        //   usersThatSharedContent.push(userThatShared)
        // })
        // state.usersThatSharedContent = usersThatSharedContent
      })
      .addCase(getSharesPerUser.rejected, (action) => {
        console.log('Request rejected ', action.payload)
      })
  },
})

export const { getOnlyUsersThatSharedContent } = mentalExpertSlice.actions
export default mentalExpertSlice.reducer
