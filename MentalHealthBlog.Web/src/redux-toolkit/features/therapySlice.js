import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  requestsForMentalHealthExpert: [],
  isLoading: false,
  isFailed: false,
}

export const getRequestsForMentalHealthExpert = createAsyncThunk(
  'therapy/requests-for-mental-health-expert',
  async (objectWithData) => {
    let query = {
      loggedUserId: objectWithData?.authenticatedUser?.id,
    }

    let url = `${application.application_url}/therapy/requests-for-mental-health-experts`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })

    let response = await request.json()
    return response
  }
)

export const changeRequestStatus = createAsyncThunk(
  'change-request-status',
  async (objectWithData) => {
    let requestObj = {
      mentalHealthExpertId: objectWithData?.authenticatedUser?.id,
      regularUserId: objectWithData?.request?.regularUserId,
      newRequestStatus: objectWithData?.newRequestStatus,
    }

    console.log('Req obj ', requestObj)

    let url = `${application.application_url}/therapy/change-request-status`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(requestObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

let therapySlice = createSlice({
  name: 'therapySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //requests-for-mental-health-expert
      .addCase(getRequestsForMentalHealthExpert.pending, () => {
        console.log('Fetching requests pending...')
      })
      .addCase(getRequestsForMentalHealthExpert.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        console.log('Action payload ', action?.payload)
        if (statusCode === 200) {
          state.requestsForMentalHealthExpert =
            action.payload.serviceResponseObject
        }

        console.log('Requests ', state.requestsForMentalHealthExpert)
      })
      .addCase(getRequestsForMentalHealthExpert.rejected, () => {
        console.log('Requests rejected...')
      })

      //change-request-status
      .addCase(changeRequestStatus.pending, () => {
        console.log('Request status change pending...')
      })
      .addCase(changeRequestStatus.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          console.log('Successfully changed status')

          state.requestsForMentalHealthExpert =
            action?.payload?.serviceResponseObject
        }
      })
      .addCase(changeRequestStatus.rejected, () => {
        console.log('Request status change rejected...')
      })
  },
})

export const {} = therapySlice.actions
export default therapySlice.reducer
