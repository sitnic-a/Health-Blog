import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'
import { toast } from 'react-toastify'
import { manipulateSidebarAndAdminStatusActions } from '../../utils/helper-methods/methods'

let initialState = {
  dbUsers: [],
  dbUser: null,
  selectedRole: 0,
  newlyRegisteredMentalHealthExperts: [],
  numberOfNewlyRegisteredMentalHealthExperts: 0,
  isLoading: false,
  isSuccessful: false,
  isFailed: null,
}

export const getDbUsers = createAsyncThunk('', async (objectWithData) => {
  console.log('Query value ', objectWithData?.query)
  let url = `${application.application_url}/admin`

  if (objectWithData?.query?.role > 0) {
    url += `?role=${objectWithData?.query?.role}`
    if (objectWithData?.query?.searchCondition !== '') {
      url += `&searchCondition=${objectWithData?.query?.searchCondition}`
    }
  } else if (
    objectWithData?.query?.searchCondition !== '' &&
    objectWithData?.query?.searchCondition !== undefined &&
    objectWithData?.query?.searchCondition !== null
  ) {
    url += `?searchCondition=${objectWithData?.query?.searchCondition}`
  }

  console.log('URL ', url)

  let request = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
    },
  })
  let response = await request.json()

  return response
})

export const getNewRegisteredExperts = createAsyncThunk(
  'new-request',
  async (objectWithData) => {
    let url = `${application.application_url}/admin/new-request`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData?.query),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const setRegisteredExpertStatus = createAsyncThunk(
  'approval',
  async (objectWithData) => {
    let url = `${application.application_url}/admin/approval`
    let request = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(objectWithData?.patchDto),
      headers: {
        'Content-Type': 'application/json-patch+json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })

    let response = await request.json()
    return response
  }
)

export const removeUserById = createAsyncThunk('id', async (objectWithData) => {
  let url = `${application.application_url}/admin/${objectWithData?.dbUser?.id}`
  let request = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
    },
  })
  let response = await request.json()
  return response
})

let adminSlice = createSlice({
  initialState,
  name: 'adminSlice',
  reducers: {
    displayProfilesContainer: () => {
      manipulateSidebarAndAdminStatusActions()
    },
    displayStatusActionsContainer: () => {
      let statusActionsContainer = document.querySelector(
        '.new-experts-status-actions-container'
      )
      let profilesContainer = document.querySelector(
        '.new-experts-main-profiles-container'
      )
      let statusHamburger = document.querySelector(
        '.new-experts-status-hamburger'
      )

      profilesContainer.style.display = 'none'
      statusActionsContainer.style.display = 'block'
      statusHamburger.style.display = 'none'
    },
    setSelectedRole: (state) => {
      let select = document.getElementById('manage-users-select-role-filter')
      state.selectedRole = parseInt(select.value)
      console.log('Selected role ', state.selectedRole)
    },
    setSelectedUser: (state, action) => {
      state.dbUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //Get Users
      .addCase(getDbUsers.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getDbUsers.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        if (statusCode === 200) {
          let serviceResponseObject = action.payload
          state.isLoading = false
          state.dbUsers = serviceResponseObject.serviceResponseObject
          state.isFailed = false
          return
        }
        state.isFailed = true
      })
      .addCase(getDbUsers.rejected, (state, action) => {
        state.isLoading = false
      })

      //New registered experts
      .addCase(getNewRegisteredExperts.pending, (state, action) => {
        console.log('New-Request: Pending...')
      })
      .addCase(getNewRegisteredExperts.fulfilled, (state, action) => {
        console.log('New-Request: Fullfilled')
        let statusCode = action?.payload?.statusCode
        let serviceResponseObject = action?.payload?.serviceResponseObject

        if (statusCode === 200) {
          state.newlyRegisteredMentalHealthExperts = serviceResponseObject
          state.numberOfNewlyRegisteredMentalHealthExperts =
            state.newlyRegisteredMentalHealthExperts.length
          state.isFailed = false
          return
        }

        state.isFailed = true
      })
      .addCase(getNewRegisteredExperts.rejected, (state, action) => {
        toast.error('Radnja nije uspješno završena!', {
          autoClose: 3000,
          position: 'bottom-right',
        })
      })

      //Set registered expert status
      .addCase(setRegisteredExpertStatus.pending, (state, action) => {
        console.log('Approval: Pending... ')
      })
      .addCase(setRegisteredExpertStatus.fulfilled, (state, action) => {
        console.log('Approval: Fullfilled')
        let statusCode = action?.payload?.statusCode

        if (statusCode === 200) {
          let serviceResponseObject =
            action?.payload?.serviceResponseObject?.serviceResponseObject

          state.newlyRegisteredMentalHealthExperts = serviceResponseObject
          return
        }
      })
      .addCase(setRegisteredExpertStatus.rejected, (state, action) => {
        console.log('Approval: Rejected')
        toast.error('Something was wrong', {
          position: 'bottom-right',
        })
      })

      //Remove user by id
      .addCase(removeUserById.pending, (state, action) => {
        console.log('Remove pending... ')
      })
      .addCase(removeUserById.fulfilled, (state, action) => {
        console.log('Remove done...', action?.payload)

        let statusCode = action?.payload?.statusCode

        if (statusCode === 200) {
          toast.success('Succesfully deleted user', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          setTimeout(() => {
            window.location.reload()
          }, 1500)
          return
        }
      })
      .addCase(removeUserById.rejected, (state, action) => {
        console.log('Remove rejected...')
        toast.error('Something went wrong!', {
          position: 'bottom-right',
        })
      })
  },
})

export const {
  displayProfilesContainer,
  displayStatusActionsContainer,
  setSelectedRole,
  setSelectedUser,
} = adminSlice.actions
export default adminSlice.reducer
