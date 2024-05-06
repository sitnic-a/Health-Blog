import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isHovered: false,
};

let tagGradeSlice = createSlice({
  name: "tagGradeSlice",
  initialState,
  reducers: {
    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },
  },
});

export const { setIsHovered } = tagGradeSlice.actions;
export default tagGradeSlice.reducer;
