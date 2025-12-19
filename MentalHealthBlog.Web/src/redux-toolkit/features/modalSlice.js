import { createSlice } from '@reduxjs/toolkit'

let modalSlice = createSlice({
  name: 'modalSlice',
  initialState: {
    isAddOpen: false,
    isDeleteOpen: false,
    isExportOpen: false,
    isShareOpen: false,
    isShareViaLinkOpen: false,
    isStopSharingOpen: false,
    emailSuccessfullySentOpen: false,
    isAssignmentResponsesOpen: false,
    isRespondingToAssignment: false,
    isTrialPeriodPopupOpen: false,
    isProhibitUserUsageModalOpen: false,
  },
  reducers: {
    openAddModal: (state, action) => {
      state.isAddOpen = action?.payload
    },
    openDeleteModal: (state, action) => {
      state.isDeleteOpen = action?.payload
    },
    openExportModal: (state, action) => {
      state.isExportOpen = action?.payload
    },
    openShareModal: (state, action) => {
      state.isShareOpen = action?.payload
    },
    openShareViaLink: (state, action) => {
      state.isShareViaLinkOpen = action?.payload
    },
    openStopSharing: (state, action) => {
      state.isStopSharingOpen = action?.payload
    },
    openEmailSuccessfullySentOpen: (state, action) => {
      state.emailSuccessfullySentOpen = action?.payload
    },
    openAssignmentResponses: (state, action) => {
      state.isAssignmentResponsesOpen = action?.payload
    },
    openRespondToAssignment: (state, action) => {
      state.isRespondingToAssignment = action?.payload
    },
    openTrialPeriodPopup: (state, action) => {
      state.isTrialPeriodPopupOpen = action?.payload
    },
    openProhibitUserUsageModal: (state, action) => {
      state.isProhibitUserUsageModalOpen = action?.payload
    },
  },
})

export const {
  openAddModal,
  openDeleteModal,
  openExportModal,
  openShareModal,
  openShareViaLink,
  openStopSharing,
  openEmailSuccessfullySentOpen,
  openAssignmentResponses,
  openRespondToAssignment,
  openTrialPeriodPopup,
  openProhibitUserUsageModal,
} = modalSlice.actions

export default modalSlice.reducer
