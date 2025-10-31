import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'
let initialState = {
  usersTrialPeriod: null,
}

export const getUsersTrialPeriod = createAsyncThunk(
  'trial/[userId]',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/trial/${objectWithData?.authenticatedUser?.id}`
    let request = await fetch(url)
    let response = await request.json()
    return response
  }
)

let subscriptionSlice = createSlice({
  name: 'subscriptionSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //
      .addCase(getUsersTrialPeriod.pending, (state, action) => {})
      .addCase(getUsersTrialPeriod.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject
        state.usersTrialPeriod = serviceResponseObject
        console.log('Action payload', state.usersTrialPeriod)
      })
      .addCase(getUsersTrialPeriod.rejected, (state, action) => {
        console.log('Error ', action?.payload)
      })
  },
})

export const {} = subscriptionSlice.actions
export default subscriptionSlice.reducer
