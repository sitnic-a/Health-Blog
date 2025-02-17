import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  dbEmotions: [],
}

export const getEmotions = createAsyncThunk('/emotions', async () => {
  let url = `${application.application_url}/emotion/`
  let request = await fetch(url)
  let response = await request.json()

  return response
})

let emotionSlice = createSlice({
  initialState,
  name: 'emotionSlice',
  reducers: {},
  extraReducers: (builder) => {
    builder

      //getDbEmotions
      .addCase(getEmotions.pending, (state, action) => {
        console.log('Db emotions pending...')
      })
      .addCase(getEmotions.fulfilled, (state, action) => {
        console.clear()
        let serviceResponseObject = action.payload.serviceResponseObject
        state.dbEmotions = serviceResponseObject
        console.log('Db Emotions fulfilled ', state.dbEmotions)
      })
      .addCase(getEmotions.rejected, (state, action) => {
        console.log('Db Emotions error ', action.payload)
      })
  },
})

export const {} = emotionSlice.actions
export default emotionSlice.reducer
