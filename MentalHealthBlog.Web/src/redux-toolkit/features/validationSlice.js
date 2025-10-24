import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  usernameValidationData: { isValid: true, validationMessages: [] },
  passwordValidationData: { isValid: true, validationMessages: [] },
  confirmationPasswordValidationData: { isValid: true, validationMessages: [] },
  firstNameValidationData: { isValid: true, validationMessages: [] },
  lastNameValidationData: { isValid: true, validationMessages: [] },
  organizationValidationData: { isValid: true, validationMessages: [] },
  phoneNumberValidationData: { isValid: true, validationMessages: [] },
  emailValidationData: { isValid: true, validationMessages: [] },
  photoValidationData: { isValid: true, validationMessages: [] },

  titleValidationData: { isValid: true, validationMessages: [] },
  contentValidationData: { isValid: true, validationMessages: [] },
  tagsValidationData: { isValid: true, validationMessages: [] },
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
    setConfirmationPasswordValidationData: (state, action) => {
      state.confirmationPasswordValidationData = action?.payload
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
    setPhotoValidationData: (state, action) => {
      state.photoValidationData = action?.payload
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
  setConfirmationPasswordValidationData,
  setFirstNameValidationData,
  setLastNameValidationData,
  setOrganizationValidationData,
  setPhoneNumberValidationData,
  setEmailValidationData,
  setPhotoValidationData,

  setTitleValidationData,
  setContentValidationData,
  setTagsValidationData,
} = validationSlice.actions
export default validationSlice.reducer
