import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../../application'

let initialState = {
  dbUsers: [],
  selectedRole: 0,
  newlyRegisteredMentalHealthExperts: [],
  numberOfNewlyRegisteredMentalHealthExperts: 0,
  isLoading: false,
  isSuccessful: false,
  isFailed: false,
}

export const getDbUsers = createAsyncThunk('', async (query) => {
  console.log('Query value ', query)
  let url = `${application.application_url}/admin`

  if (query.role > 0) {
    url += `?role=${query.role}`
    if (query.searchCondition !== '') {
      url += `&searchCondition=${query.searchCondition}`
    }
  } else if (
    query.searchCondition !== '' &&
    query.searchCondition !== undefined &&
    query.searchCondition !== null
  ) {
    url += `?searchCondition=${query.searchCondition}`
  }

  console.log('URL ', url)

  let request = await fetch(url)
  let response = await request.json()

  return response
})

export const getNewRegisteredExperts = createAsyncThunk(
  'new-request',
  async (query) => {
    let url = `${application.application_url}/admin/new-request`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let response = await request.json()
    return response
  }
)

export const setRegisteredExpertStatus = createAsyncThunk(
  'approval',
  async (statusDto) => {
    let url = `${application.application_url}/admin/approval`
    let request = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(statusDto),
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    })
    let response = await request.json()
    console.log('Response ', response)
    return response
  }
)

let adminSlice = createSlice({
  initialState,
  name: 'adminSlice',
  extraReducers: (builder) => {
    builder
      //Get Users
      .addCase(getDbUsers.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getDbUsers.fulfilled, (state, action) => {
        let serviceResponseObject = action.payload
        state.isLoading = false
        console.log('SSS ', serviceResponseObject)

        state.dbUsers = serviceResponseObject.serviceResponseObject
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
        let serviceResponseObject = action.payload.serviceResponseObject
        state.newlyRegisteredMentalHealthExperts = serviceResponseObject
        state.numberOfNewlyRegisteredMentalHealthExperts =
          state.newlyRegisteredMentalHealthExperts.length
      })
      .addCase(getNewRegisteredExperts.rejected, (state, action) => {
        console.log('New-Request: Rejected')
        console.log(action.payload)
      })

      //Set registered expert status
      .addCase(setRegisteredExpertStatus.pending, (state, action) => {
        console.log('Approval: Pending... ')
      })
      .addCase(setRegisteredExpertStatus.fulfilled, (state, action) => {
        console.log('Approval: Fullfilled')
        console.log(action)

        let serviceResponseObject =
          action.payload.serviceResponseObject.serviceResponseObject

        state.newlyRegisteredMentalHealthExperts = serviceResponseObject
      })
      .addCase(setRegisteredExpertStatus.rejected, (state, action) => {
        console.log('Approval: Rejected')
      })
  },
  reducers: {
    displayProfilesContainer: () => {
      let statusActionsContainer = document.querySelector(
        '.new-experts-status-actions-container'
      )
      let profilesContainer = document.querySelector(
        '.new-experts-main-profiles-container'
      )
      let profileContainer = document.querySelectorAll(
        '.new-expert-profile-container'
      )
      let statusHamburger = document.querySelector(
        '.new-experts-status-hamburger'
      )
      if (window.screen.width <= 500) {
        profilesContainer.style.display = 'flex'
        profilesContainer.style.maxWidth = '1440px'
        profileContainer.forEach((profile) => {
          profile.style.margin = 'auto'
        })
        statusActionsContainer.style.display = 'none'
        statusHamburger.style.display = 'block'
      }
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
  },
})

export const {
  displayProfilesContainer,
  displayStatusActionsContainer,
  setSelectedRole,
} = adminSlice.actions
export default adminSlice.reducer
