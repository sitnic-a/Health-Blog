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

export const setTrialToExpired = createAsyncThunk(
  'trial-expired',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/trial-expired`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const sendTrialExpiringnEmail = createAsyncThunk(
  'trial-expiring-email-notification',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/trial-expiring-email-notification`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
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

      //getUsersTrialPeriod
      .addCase(getUsersTrialPeriod.pending, (state, action) => {})
      .addCase(getUsersTrialPeriod.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject
        state.usersTrialPeriod = serviceResponseObject
        // console.log('Action payload', state.usersTrialPeriod)
      })
      .addCase(getUsersTrialPeriod.rejected, (state, action) => {
        console.log('Error ', action?.payload)
      })

      //setTrialToExpired
      .addCase(setTrialToExpired.pending, (state, action) => {})
      .addCase(setTrialToExpired.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          state.usersTrialPeriod = action?.payload?.serviceResponseObject
        }
      })
      .addCase(setTrialToExpired.rejected, (state, action) => {})

      //sendTrialExpiringnEmail
      .addCase(sendTrialExpiringnEmail.pending, (state, action) => {})
      .addCase(sendTrialExpiringnEmail.fulfilled, (state, action) => {})
      .addCase(sendTrialExpiringnEmail.rejected, (state, action) => {})
  },
})

export const {} = subscriptionSlice.actions
export default subscriptionSlice.reducer
