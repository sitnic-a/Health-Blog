import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  dbAssignments: [],
  dbAssignmentResponses: [],
  pickedAssignment: null,
}

export const getUsersAssignments = createAsyncThunk(
  'users-assignments',
  async (objectWithData) => {
    let url = `${application.application_url}/assignment/users-assignments`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.request),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const getAssignmentResponses = createAsyncThunk(
  'assignment-responses/{id}',
  async (objectWithData) => {
    let url = `${application.application_url}/assignment/assignment-responses/${objectWithData?.assignmentObj?.id}`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const respondToAssignment = createAsyncThunk(
  'respond',
  async (objectWithData) => {
    let url = `${application.application_url}/assignment/respond`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.request),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const assignmentSlice = createSlice({
  initialState,
  name: 'assignmentSlice',
  reducers: {
    setChosenAssignment: (state, action) => {
      state.pickedAssignment = action?.payload
      return state
    },
    resetData: (state, action) => {
      state.dbAssignmentResponses = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //users-assignments
      .addCase(getUsersAssignments.pending, (state, action) => {})
      .addCase(getUsersAssignments.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let usersAssignments = action?.payload?.serviceResponseObject
        if (statusCode === 200 && usersAssignments?.length > 0) {
          state.dbAssignments = usersAssignments
        }
      })
      .addCase(getUsersAssignments.rejected, (state, action) => {})

      //assignment-responses/{id}
      .addCase(getAssignmentResponses.pending, (state, action) => {})
      .addCase(getAssignmentResponses.fulfilled, (state, action) => {
        // console.log('Assignment responses fulfilled ', action?.payload)
        let statusCode = action?.payload?.statusCode
        let assignmentResponses = action?.payload?.serviceResponseObject

        if (statusCode === 200 && assignmentResponses?.length > 0) {
          state.dbAssignmentResponses = assignmentResponses
        }
      })
      .addCase(getAssignmentResponses.rejected, (state, action) => {})

      //respond
      .addCase(respondToAssignment.pending, (state, action) => {})
      .addCase(respondToAssignment.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let assignmentResponses = action?.payload?.serviceResponseObject
        if (statusCode === 201 && assignmentResponses?.length > 0) {
          state.dbAssignmentResponses = assignmentResponses
        }
      })
      .addCase(respondToAssignment.rejected, (state, action) => {})
  },
})

export const { setChosenAssignment, resetData } = assignmentSlice.actions
export default assignmentSlice.reducer
