import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  dbAssignments: [],
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
      },
    })
    let response = await request.json()
    return response
  }
)

export const assignmentSlice = createSlice({
  initialState,
  name: 'assignmentSlice',
  reducers: {},
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
        console.log('Ass ', state.dbAssignments)
      })
      .addCase(getUsersAssignments.rejected, (state, action) => {})
  },
})

export const {} = assignmentSlice.actions
export default assignmentSlice.reducer
