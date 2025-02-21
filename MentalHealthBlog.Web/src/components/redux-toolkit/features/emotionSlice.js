import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  dbEmotions: [],
  suggestedEmotions: [],
  pickedEmotions: [],
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
  reducers: {
    setSuggestedEmotions: (state, action) => {
      console.log('Action payload ', action.payload)
      state.suggestedEmotions = action.payload
    },

    setPickedEmotions: (state, action) => {
      console.log('Picked emotions payload ', action.payload)
      state.pickedEmotions = action.payload
      console.log('Picked emotions ', state.pickedEmotions)
    },
  },
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

export const { setSuggestedEmotions, setPickedEmotions } = emotionSlice.actions
export default emotionSlice.reducer
