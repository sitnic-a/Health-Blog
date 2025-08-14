import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isFiltering: false,
};

let filterSlice = createSlice({
  name: "filterSlice",
  initialState: initialState,
  reducers: {
    setVisibility: (state) => {
      state.isFiltering = !state.isFiltering;
    },
  },
});

export const { setVisibility } = filterSlice.actions;
export default filterSlice.reducer;
