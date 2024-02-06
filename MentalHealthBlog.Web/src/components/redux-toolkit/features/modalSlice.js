import { createSlice } from '@reduxjs/toolkit'

let modalSlice = createSlice({
  name: 'modalSlice',
  initialState: {
    isAddOpen: false,
    isDeleteOpen: false,
  },
  reducers: {
    openAddModal: (state, action) => {
      state.isAddOpen = action.payload
    },
    openDeleteModal: (state, action) => {
      state.isDeleteOpen = action.payload
    },
  },
})

export const { openAddModal, openDeleteModal } = modalSlice.actions

export default modalSlice.reducer
