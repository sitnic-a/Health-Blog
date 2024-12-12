import { createSlice } from '@reduxjs/toolkit'

let modalSlice = createSlice({
  name: 'modalSlice',
  initialState: {
    isAddOpen: false,
    isDeleteOpen: false,
    isExportOpen: false,
    isShareOpen: false,
    isShareViaLinkOpen: false,
  },
  reducers: {
    openAddModal: (state, action) => {
      state.isAddOpen = action.payload
    },
    openDeleteModal: (state, action) => {
      state.isDeleteOpen = action.payload
    },
    openExportModal: (state, action) => {
      state.isExportOpen = action.payload
    },
    openShareModal: (state, action) => {
      state.isShareOpen = action.payload
    },
    openShareViaLink: (state, action) => {
      state.isShareViaLinkOpen = action.payload
    },
  },
})

export const {
  openAddModal,
  openDeleteModal,
  openExportModal,
  openShareModal,
  openShareViaLink,
} = modalSlice.actions

export default modalSlice.reducer
