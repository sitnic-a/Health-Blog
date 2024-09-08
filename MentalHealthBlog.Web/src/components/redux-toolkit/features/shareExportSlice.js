import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  postsToShare: [],
  postsToExport: [],
}

let shareExportSlice = createSlice({
  name: 'shareExportSlice',
  initialState,
  reducers: {
    // getSelectedPosts: (state, action) => {
    //   state.postsToShare = action.payload
    // },
  },
})

export default shareExportSlice.reducer
