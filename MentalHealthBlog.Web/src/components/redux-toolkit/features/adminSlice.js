import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  newlyRegisteredMentalHealthExperts: [],
  numberOfNewlyRegisteredMentalHealthExperts: 0,
}

export const getNewRegisteredExperts = createAsyncThunk(
  'new-request',
  async () => {
    let url = `${application.application_url}/admin/new-request`
    let request = await fetch(url)
    let response = await request.json()
    return response
  }
)

export const setRegisteredExpertStatus = createAsyncThunk(
  'approval',
  async (statusDto) => {
    let url = `${application.application_url}/admin/approval`
    let request = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(statusDto),
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    })
    let response = await request.json()
    console.log('Response ', response)
    return response
  }
)

let adminSlice = createSlice({
  initialState,
  name: 'adminSlice',
  extraReducers: (builder) => {
    builder
      //New registered experts
      .addCase(getNewRegisteredExperts.pending, (state, action) => {
        console.log('New-Request: Pending...')
      })
      .addCase(getNewRegisteredExperts.fulfilled, (state, action) => {
        console.log('New-Request: Fullfilled')
        let serviceResponseObject = action.payload.serviceResponseObject
        state.newlyRegisteredMentalHealthExperts = serviceResponseObject
        state.numberOfNewlyRegisteredMentalHealthExperts =
          state.newlyRegisteredMentalHealthExperts.length
      })
      .addCase(getNewRegisteredExperts.rejected, (state, action) => {
        console.log('New-Request: Rejected')
        console.log(action.payload)
      })

      //Set registered expert status
      .addCase(setRegisteredExpertStatus.pending, (state, action) => {
        console.log('Approval: Pending... ')
      })
      .addCase(setRegisteredExpertStatus.fulfilled, (state, action) => {
        console.log('Approval: Fullfilled')
        console.log(action)

        let serviceResponseObject =
          action.payload.serviceResponseObject.serviceResponseObject
        state.newlyRegisteredMentalHealthExperts = serviceResponseObject
      })
      .addCase(setRegisteredExpertStatus.rejected, (state, action) => {
        console.log('Approval: Rejected')
      })
  },
})

export default adminSlice.reducer
