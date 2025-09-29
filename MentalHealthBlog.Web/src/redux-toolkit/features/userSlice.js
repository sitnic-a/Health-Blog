import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { application } from '../../application'
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
  dbUser: null,
  dbRoles: [],
}

export const getQuote = createAsyncThunk('quote', async () => {
  let url = 'https://type.fit/api/quotes'
  let request = await fetch(url)
  let response = request.json()
  return response
})

export const getUserById = createAsyncThunk('user/id', async (id) => {
  let url = `${application.application_url}/user/${id}`
  let request = await fetch(url)
  let response = await request.json()
  return response
})

export const login = createAsyncThunk('/user/login', async (user) => {
  let url = `${application.application_url}/user/login`
  let request = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  let response = await request.json()
  return response
})

export const refreshAccessToken = createAsyncThunk(
  '/user/refresh-access-token',
  async (refreshToken) => {
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
    headers: {
      'Content-Type': 'application/json',
    },
  })
  let response = await request.json()
  return response
})

export const requestPasswordChange = createAsyncThunk(
  'request-password-change',
  async (objectWithData) => {
    let url = `${application.application_url}/user/request-password-change`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(objectWithData?.email),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const changePassword = createAsyncThunk(
  'change-password',
  async (objectWithData) => {
    let url = `${application.application_url}/user/change-password`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(objectWithData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setIsFailed: (state, action) => {
      state.isFailed = action.payload
    },
    setAuthenticatedUser: (state, action) => {
      state.authenticatedUser = action.payload?.serviceResponseObject
    },
  },
  extraReducers: (builder) => {
    builder

      //--- getUserById
      .addCase(getUserById.pending, (state, action) => {})
      .addCase(getUserById.fulfilled, (state, action) => {
        let userById = action.payload.serviceResponseObject
        state.dbUser = userById
      })
      .addCase(getUserById.rejected, (state, action) => {})

      //--- login
      .addCase(login.pending, (state) => {
        state.isLogging = true
        state.isLoading = true
      })
      .addCase(login.rejected, (state) => {
        state.isFailed = true
        state.isLoading = false
        state.isLogging = false
        state.isAuthenticated = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.statusCode = action.payload.statusCode
        if (state.statusCode === 200) {
          state.authenticatedUser = action.payload.serviceResponseObject
          state.isLogging = false
          state.isLoading = false
          state.isAuthenticated = true
          return
        }
        if (
          state.statusCode !== 200 ||
          state.statusCode !== 201 ||
          state.statusCode !== 204
        ) {
          toast.error('Korisnik ne postoji, probajte ponovo!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          state.isLoading = false
          state.isLogging = false
          state.isAuthenticated = false
          state.authenticatedUser = null
          return
        }
      })

      //refresh-access-token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false
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
        state.statusCode = action.payload.statusCode
        if (state.statusCode === 201) {
          toast.success('Uspješno ste kreirali profil', {
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
          toast.error('Registracija korisnika nije moguća!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          state.isLoading = false
          return
        }
      })

      //getDbRoles
      .addCase(getDbRoles.pending, (state, action) => {})
      .addCase(getDbRoles.fulfilled, (state, action) => {
        state.dbRoles = action.payload.serviceResponseObject
      })

      //logout
      .addCase(logout.pending, (state, action) => {})
      .addCase(logout.fulfilled, (state, action) => {
        toast.success('Uspješno ste se odjavili!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      })
      .addCase(logout.rejected, (state, action) => {})

      //requestPasswordChange
      .addCase(requestPasswordChange.pending, (state, action) => {
        let requestPasswordSendButton = document.querySelector(
          '.request-password-change-send-request-button'
        )
        requestPasswordSendButton.style.display = 'none'

        let requestPasswordInfoMessage = document.querySelector(
          '.request-password-send-request-info-message'
        )
        requestPasswordInfoMessage.style.display = 'flex'
      })
      .addCase(requestPasswordChange.fulfilled, (state, action) => {
        let requestPasswordInfoMessage = document.querySelector(
          '.request-password-send-request-info-message'
        )
        requestPasswordInfoMessage.style.display = 'none'

        let StatusCode = action?.payload?.StatusCode
        let statusCode = action?.payload?.statusCode
        if (StatusCode !== 200 && statusCode !== 200) {
          toast.error('Email nije moguće poslati', {
            autoClose: 3000,
            position: 'bottom-right',
          })

          let requestPasswordSendButton = document.querySelector(
            '.request-password-change-send-request-button'
          )
          requestPasswordSendButton.style.display = 'initial'
          return
        }

        let requestPasswordSendButton = document.querySelector(
          '.request-password-change-send-request-button'
        )
        requestPasswordSendButton.style.display = 'initial'
        toast.success('Email uspješno poslan', {
          autoClose: 3000,
          position: 'bottom-right',
        })
        return
      })
      .addCase(requestPasswordChange.rejected, (state, action) => {
        let requestPasswordInfoMessage = document.querySelector(
          '.request-password-send-request-info-message'
        )
        requestPasswordInfoMessage.style.display = 'none'
        toast.error('Email nije moguće poslati', {
          autoClose: 3000,
          position: 'bottom-right',
        })

        let requestPasswordSendButton = document.querySelector(
          '.request-password-change-send-request-button'
        )
        requestPasswordSendButton.style.display = 'initial'
      })

      //changePassword
      .addCase(changePassword.pending, (state, action) => {})
      .addCase(changePassword.fulfilled, (state, action) => {
        console.log('Successfully changed pass')
      })
      .addCase(changePassword.rejected, (state, action) => {})
  },
})

export const { setIsFailed, setAuthenticatedUser } = userSlice.actions
export default userSlice.reducer
