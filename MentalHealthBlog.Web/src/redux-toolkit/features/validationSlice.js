import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  usernameValidationData: { isValid: true, validationMessages: [] },
  passwordValidationData: { isValid: true, validationMessages: [] },
  firstNameValidationData: { isValid: true, validationMessages: [] },
  lastNameValidationData: { isValid: true, validationMessages: [] },
  organizationValidationData: { isValid: true, validationMessages: [] },
  emailValidationData: { isValid: true, validationMessages: [] },
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
    setFirstNameValidationData: (state, action) => {
      state.firstNameValidationData = action?.payload
    },
    setLastNameValidationData: (state, action) => {
      state.lastNameValidationData = action?.payload
    },
    setOrganizationValidationData: (state, action) => {
      state.organizationValidationData = action?.payload
    },
    setEmailValidationData: (state, action) => {
      state.emailValidationData = action?.payload
    },
  },
})

export const {
  setUsernameValidationData,
  setPasswordValidationData,
  setFirstNameValidationData,
  setLastNameValidationData,
  setOrganizationValidationData,
  setEmailValidationData,
} = validationSlice.actions
export default validationSlice.reducer
