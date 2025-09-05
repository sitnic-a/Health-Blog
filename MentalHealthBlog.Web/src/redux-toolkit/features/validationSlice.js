import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  usernameMessages: [],
  passwordValidationData: { isValid: true, validationMessages: [] },
}

const validationSlice = createSlice({
  initialState,
  name: 'validationSlice',
  reducers: {
    setPasswordValidationData: (state, action) => {
      state.passwordValidationData = action?.payload
    },
  },
})

export const { setPasswordValidationData } = validationSlice.actions
export default validationSlice.reducer
