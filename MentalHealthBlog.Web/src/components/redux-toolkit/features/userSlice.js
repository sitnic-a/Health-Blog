import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  isFailed: false,
  quote: null,
  timer: 5000,
  _TIME_: 5000,
};

export const getQuote = createAsyncThunk("quote", async () => {
  let url = "https://type.fit/api/quotes";
  let request = await fetch(url);
  let response = request.json();
  return response;
});

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //--- getQuote
      .addCase(getQuote.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getQuote.rejected, (state) => {
        state.isFailed = true;
      })
      .addCase(getQuote.fulfilled, (state, action) => {
        console.log("Get quote ", action.payload);
        let response = action.payload;
        let arraySize = response.length;
        let randomNumber = Math.floor(Math.random() * arraySize) + 1;
        let obj = { ...response[randomNumber] };
        state.quote = {
          text: obj.text,
          author: obj.author,
        };
        console.log("Quote object ", obj);
      });
  },
});

export const { get } = userSlice.actions;

export default userSlice.reducer;
