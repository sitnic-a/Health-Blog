import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { application } from '../../../application'
import { toast } from 'react-toastify'

let initialState = {
  isLoading: false,
  isLogging: false,
  isFailed: false,
  quote: null,
  authenticatedUser: null,
  isAuthenticated: false,
  isRegistered: false,
  statusCode: null,
  dbRoles: [],
}

export const getQuote = createAsyncThunk('quote', async () => {
  let url = 'https://type.fit/api/quotes'
  let request = await fetch(url)
  let response = request.json()
  return response
})

export const login = createAsyncThunk('/user/login', async (user) => {
  // console.log("User on submit ", user);
  let url = `${application.application_url}/user/login`
  let request = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  // console.log("Request ", request.headers);

  let response = await request.json()
  // console.log("Response ", response);
  return response
})

export const refreshAccessToken = createAsyncThunk(
  '/user/refresh-access-token',
  async (refreshToken) => {
    console.log('User slice refresh token ', refreshToken)

    let url = `${application.application_url}/user/refresh-access-token`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(refreshToken),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const register = createAsyncThunk('/user/register', async (user) => {
  console.log('User on submit ', user)
  let url = `${application.application_url}/user/register`
  let request = await fetch(url, {
    method: 'POST',
    body: user,
    headers: {},
  })
  let response = await request.json()
  return response
})

export const getDbRoles = createAsyncThunk('/user/roles', async () => {
  console.log('Get roles invoked')
  let url = `${application.application_url}/user/roles`
  let request = await fetch(url)
  let response = await request.json()
  return response
})

export const logout = createAsyncThunk('user/logout', async (logoutRequest) => {
  let url = `${application.application_url}/user/logout`
  let request = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(logoutRequest),
  })
  let response = await request.json()
  return response
})

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setIsFailed: (state, action) => {
      state.isFailed = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //--- login
      .addCase(login.pending, (state) => {
        state.isLogging = true
        state.isLoading = true
      })
      .addCase(login.rejected, (state) => {
        state.isFailed = true
        state.isAuthenticated = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.statusCode = action.payload.statusCode
        if (state.statusCode === 200) {
          state.authenticatedUser = action.payload.serviceResponseObject
          state.isLogging = false
          state.isLoading = false
          state.isAuthenticated = true
          // console.log("Logged succesfully ", action.payload);
          return
        }
        if (
          state.statusCode !== 200 ||
          state.statusCode !== 201 ||
          state.statusCode !== 204
        ) {
          toast.error('Invalid credentials, try again', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          // console.log("Logged unsuccessfully");
          state.isLoading = false
          state.isLogging = false
          state.isAuthenticated = false
          state.authenticatedUser = null
          return
        }
      })

      //refresh-access-token
      .addCase(refreshAccessToken.pending, (state) => {
        // console.log("Refreshing token...");
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        let response = action.payload.serviceResponseObject
        // console.log("New access token ", response);
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        let response = action.payload
        // console.log("New access token error ", response);
      })

      //--- register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.isRegistered = false
      })
      .addCase(register.rejected, (state) => {
        state.isFailed = true
        state.isRegistered = false
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('Register fulfilled ', action.payload)
        state.statusCode = action.payload.statusCode
        if (state.statusCode === 201) {
          toast.success("You've successfully created an account", {
            autoClose: 1500,
            position: 'bottom-right',
          })
          state.isRegistered = true
          state.isLoading = false
          return
        }
        if (
          state.statusCode !== 200 ||
          state.statusCode !== 201 ||
          state.statusCode !== 204
        ) {
          toast.error("Couldn't register this user", {
            autoClose: 1500,
            position: 'bottom-right',
          })
          // console.log("Logged unsuccessfully");
          state.isLoading = false
          return
        }
      })

      //getDbRoles
      .addCase(getDbRoles.pending, (state, action) => {})
      .addCase(getDbRoles.fulfilled, (state, action) => {
        console.log('Fetched roles -> ', action.payload)
        state.dbRoles = action.payload.serviceResponseObject
      })

      .addCase(logout.pending, (state, action) => {
        console.log('Logging out...')
        console.log(action.meta)
      })
      .addCase(logout.fulfilled, (state, action) => {
        console.log('User successfully signed out...')
      })
      .addCase(logout.rejected, (state, action) => {
        console.log('Error')
      })
  },
})

export const { setIsFailed } = userSlice.actions
export default userSlice.reducer
