import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  usernameValidationData: { isValid: true, validationMessages: [] },
  passwordValidationData: { isValid: true, validationMessages: [] },
  firstNameValidationData: { isValid: true, validationMessages: [] },
  lastNameValidationData: { isValid: true, validationMessages: [] },
  organizationValidationData: { isValid: true, validationMessages: [] },
  phoneNumberValidationData: { isValid: true, validationMessages: [] },
  emailValidationData: { isValid: true, validationMessages: [] },

  titleValidationData: { isValid: true, validationMessages: [] },
  contentValidationData: { isValid: true, validationMessages: [] },
  tagsValidationData: { isValid: true, validationMessages: [] },
}

const validationSlice = createSlice({
  initialState,
  name: 'validationSlice',
  reducers: {
    setUsernameValidationData: (state, action) => {
      state.usernameValidationData.isValid = action?.payload?.usernameIsValid
      state.usernameValidationData.validationMessages =
        action?.payload?.usernameValidationMessages
    },
    setPasswordValidationData: (state, action) => {
      state.passwordValidationData.isValid = action?.payload?.passwordIsValid
      state.passwordValidationData.validationMessages =
        action?.payload?.passwordValidationMessages
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
    setPhoneNumberValidationData: (state, action) => {
      state.phoneNumberValidationData = action?.payload
    },
    setEmailValidationData: (state, action) => {
      state.emailValidationData = action?.payload
    },

    setTitleValidationData: (state, action) => {
      state.titleValidationData = action?.payload
    },
    setContentValidationData: (state, action) => {
      state.contentValidationData = action?.payload
    },
    setTagsValidationData: (state, action) => {
      state.tagsValidationData = action?.payload
    },
  },
})

export const {
  setUsernameValidationData,
  setPasswordValidationData,
  setFirstNameValidationData,
  setLastNameValidationData,
  setOrganizationValidationData,
  setPhoneNumberValidationData,
  setEmailValidationData,

  setTitleValidationData,
  setContentValidationData,
  setTagsValidationData,
} = validationSlice.actions
export default validationSlice.reducer
