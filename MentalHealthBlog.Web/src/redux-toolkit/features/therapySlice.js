import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  requestsForMentalHealthExpert: [],
  isLoading: false,
  isFailed: false,
  myApprovedOrPendingMentalHealthExperts: [],
  myCurrentMentalHealthExperts: [],
  selectedMentalHealthExpertIds: [],
  stopSharingObject: {},
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

export const getMyExperts = createAsyncThunk(
  'my-experts',
  async (objectWithData) => {
    let url = `${application.application_url}/therapy/my-experts`
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

export const changeRequestStatus = createAsyncThunk(
  'change-request-status',
  async (objectWithData) => {
    let url = `${application.application_url}/therapy/change-request-status`
    let request = await fetch(url, {
      method: 'PUT',
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

export const stopSharing = createAsyncThunk(
  '[delete]',
  async (objectWithData) => {
    let url = `${application.application_url}/therapy`
    let request = await fetch(url, {
      method: 'DELETE',
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

let therapySlice = createSlice({
  name: 'therapySlice',
  initialState,
  reducers: {
    setSelectedMentalHealthExpertIds: (state, action) => {
      state.selectedMentalHealthExpertIds = action?.payload
    },
    setExperts: (state, action) => {
      state.myApprovedOrPendingMentalHealthExperts =
        action?.payload?.serviceResponseObject
    },
    setStopSharingObject: (state, action) => {
      state.stopSharingObject = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //requests-for-mental-health-expert
      .addCase(getRequestsForMentalHealthExpert.pending, () => {})
      .addCase(getRequestsForMentalHealthExpert.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          state.requestsForMentalHealthExpert =
            action?.payload?.serviceResponseObject
        }
      })
      .addCase(getRequestsForMentalHealthExpert.rejected, () => {})

      //my-experts
      .addCase(getMyExperts.pending, () => {})
      .addCase(getMyExperts.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          state.myApprovedOrPendingMentalHealthExperts =
            action?.payload?.serviceResponseObject
        }
      })
      .addCase(getMyExperts.rejected, () => {})

      //change-request-status
      .addCase(changeRequestStatus.pending, () => {})
      .addCase(changeRequestStatus.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          state.requestsForMentalHealthExpert =
            action?.payload?.serviceResponseObject
        }
      })
      .addCase(changeRequestStatus.rejected, () => {})

      //stop-sharing
      .addCase(stopSharing.pending, () => {})
      .addCase(stopSharing.fulfilled, (state, action) => {})
      .addCase(stopSharing.rejected, () => {})
  },
})

export const {
  setSelectedMentalHealthExpertIds,
  setExperts,
  setStopSharingObject,
} = therapySlice.actions
export default therapySlice.reducer
