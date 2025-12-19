import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'
import { toast } from 'react-toastify'

let initialState = {
  subscriptionUsers: [],
  usersTrialPeriod: null,
  currentSubscription: null,
  subscriptionPlanId: 0,
  newSubscription: null,
  userToProhibitUsage: null,
  isLoading: false,
}

export const getSubscriptionUsers = createAsyncThunk(
  'subscription-users',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/subscription-users`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.query),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = request.json()
    return response
  }
)

export const getUsersTrialPeriod = createAsyncThunk(
  'trial/[userId]',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/trial/${objectWithData?.authenticatedUser?.id}`
    let request = await fetch(url)
    let response = await request.json()
    return response
  }
)

export const getUsersCurrentSubscription = createAsyncThunk(
  'user/[userid]/current-subscription',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/user/${objectWithData?.authenticatedUser?.id}/current-subscription`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = request.json()
    return response
  }
)

export const setTrialToExpired = createAsyncThunk(
  'trial-expired',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/trial-expired`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const setSubscriptionPaidStatus = createAsyncThunk(
  'set-subscription-paid-status',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/set-subscription-paid-status`
    let request = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = request.json()
    return response
  }
)

export const sendExpiringEmail = createAsyncThunk(
  'trial-expiring-email-notification',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/expiring-email-notification`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const createSubscription = createAsyncThunk(
  'create-subscription',
  async (objectWithData) => {
    let url = `${application.application_url}/subscription/create-subscription`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.requestObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

let subscriptionSlice = createSlice({
  name: 'subscriptionSlice',
  initialState,
  reducers: {
    setSubscriptionPlanId: (state, action) => {
      state.subscriptionPlanId = action?.payload
    },
    setUserToProhibitUsage: (state, action) => {
      state.userToProhibitUsage = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //getSubscriptionUsers
      .addCase(getSubscriptionUsers.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getSubscriptionUsers.fulfilled, (state, action) => {
        state.isLoading = false
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject

        if (statusCode === 200 && serviceResponseObject?.length > 0) {
          toast.success(
            'Uspješno ste dobavili sve korisnike i njihove uplate',
            {
              autoClose: 3500,
              position: 'bottom-right',
            }
          )
          state.subscriptionUsers = serviceResponseObject
        } else if (statusCode === 200 && serviceResponseObject?.length === 0) {
          toast.warning('Trenutno nema registrovanih korisnika!', {
            autoClose: 3500,
            position: 'bottom-right',
          })
          state.subscriptionUsers = serviceResponseObject
        }
      })
      .addCase(getSubscriptionUsers.rejected, (state, action) => {
        state.isLoading = false
      })

      //getUsersTrialPeriod
      .addCase(getUsersTrialPeriod.pending, (state, action) => {})
      .addCase(getUsersTrialPeriod.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject
        state.usersTrialPeriod = serviceResponseObject
      })
      .addCase(getUsersTrialPeriod.rejected, (state, action) => {})

      //setTrialToExpired
      .addCase(setTrialToExpired.pending, (state, action) => {})
      .addCase(setTrialToExpired.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          state.usersTrialPeriod = action?.payload?.serviceResponseObject
        }
      })
      .addCase(setTrialToExpired.rejected, (state, action) => {})

      //sendTrialExpiringnEmail
      .addCase(sendExpiringEmail.pending, (state, action) => {})
      .addCase(sendExpiringEmail.fulfilled, (state, action) => {})
      .addCase(sendExpiringEmail.rejected, (state, action) => {})

      //createSubscription
      .addCase(createSubscription.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false

        let statusCode = action?.payload?.statusCode
        if (statusCode === 201) {
          state.newSubscription = action?.payload?.serviceResponseObject
        }
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false
      })

      //getUsersCurrentSubscription
      .addCase(getUsersCurrentSubscription.pending, (state, action) => {})
      .addCase(getUsersCurrentSubscription.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject
        if (statusCode === 200 && serviceResponseObject !== null) {
          state.currentSubscription = serviceResponseObject
        }
      })
      .addCase(getUsersCurrentSubscription.rejected, (state, action) => {})

      //setSubscriptionPaidStatus
      .addCase(setSubscriptionPaidStatus.pending, (state, action) => {})
      .addCase(setSubscriptionPaidStatus.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject
        if (statusCode === 200) {
          state.currentSubscription = serviceResponseObject
        }
      })
      .addCase(setSubscriptionPaidStatus.rejected, (state, action) => {})
  },
})

export const { setSubscriptionPlanId, setUserToProhibitUsage } =
  subscriptionSlice.actions
export default subscriptionSlice.reducer
