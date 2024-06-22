import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  isHovered: false,
  hoveredPost: null,
  hoveredTag: null,
}

let tagGradeSlice = createSlice({
  name: 'tagGradeSlice',
  initialState,
  reducers: {
    setIsHovered: (state, action) => {
      state.isHovered = action.payload
    },
    setHoveredPost: (state, action) => {
      state.hoveredPost = action.payload
    },
    setHoveredTag: (state, action) => {
      if (state.hoveredPost !== null) {
        let wantedTag = state.hoveredPost.tags.find(
          (tag) => tag === action.payload
        )
        state.hoveredTag = wantedTag
      }
    },
  },
})

export const { setIsHovered, setHoveredPost, setHoveredTag } =
  tagGradeSlice.actions
export default tagGradeSlice.reducer
