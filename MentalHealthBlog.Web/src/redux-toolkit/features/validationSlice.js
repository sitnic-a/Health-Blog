import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  usernameValidationData: { isValid: true, validationMessages: [] },
  passwordValidationData: { isValid: true, validationMessages: [] },
}

const validationSlice = createSlice({
  initialState,
  name: 'validationSlice',
  reducers: {
    setUsernameValidationData: (state, action) => {
      state.usernameValidationData = action?.payload
    },
    setPasswordValidationData: (state, action) => {
      state.passwordValidationData = action?.payload
    },
  },
})

export const { setUsernameValidationData, setPasswordValidationData } =
  validationSlice.actions
export default validationSlice.reducer
