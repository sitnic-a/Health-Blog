import { createSlice } from "@reduxjs/toolkit";

let modalSlice = createSlice({
  name: "modalSlice",
  initialState: {
    isAddOpen: false,
    isDeleteOpen: false,
    isExportOpen: false,
  },
  reducers: {
    openAddModal: (state, action) => {
      state.isAddOpen = action.payload;
    },
    openDeleteModal: (state, action) => {
      state.isDeleteOpen = action.payload;
    },
    openExportModal: (state, action) => {
      state.isExportOpen = action.payload;
    },
  },
});

export const { openAddModal, openDeleteModal, openExportModal } =
  modalSlice.actions;

export default modalSlice.reducer;
