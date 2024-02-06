import { createSlice } from '@reduxjs/toolkit'

let postSlice = createSlice({
  name: 'postSlice',
  initialState: {
    post: [],
    isLoading: false,
    isSuccessful: false,
    isFailed: false,
  },
})

export default postSlice.reducer
