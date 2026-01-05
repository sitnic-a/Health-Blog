import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { application } from '../../application'

let initialState = {
  dbMentalHealthExperts: [],
  suggestedMentalHealthExperts: [],
  usersThatSharedContent: [],
  usersWithSetAssignments: [],
  sharedContent: [],
  usersThatSharedIncludingItsContent: {},
  overlayPost: null,
  isLoadingExperts: false,
  isLoading: false,
}

export const getMentalHealthExperts = createAsyncThunk(
  'experts',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/experts`
    let query
    if (objectWithData !== null && objectWithData !== undefined) {
      query = {
        loggedUserId: objectWithData?.authenticatedUser?.id,
        isFiltering: true,
      }
    }
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

export const getSharesPerUser = createAsyncThunk(
  'shares-per-user',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/shares-per-user?LoggedExpertId=${objectWithData.query.loggedExpertId}`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()

    return response
  }
)

export const createAssignment = createAsyncThunk(
  'give-assignment',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/give-assignment`
    let request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(objectWithData.addAssignmentObj),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const getUsersWithSetAssignments = createAsyncThunk(
  'users-with-set-assignments',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/users-with-set-assignments?LoggedExpertId=${objectWithData?.query?.loggedExpertId}`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData?.authenticatedUser?.jwToken}`,
      },
    })
    let response = await request.json()
    return response
  }
)

export const sendInviteToRegularUser = createAsyncThunk(
  'invite/user',
  async (objectWithData) => {
    let url = `${application.application_url}/mentalExpert/invite/user`
    let request = await fetch(url, {
      method: 'POST',
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

export const mentalExpertSlice = createSlice({
  name: 'mentalExpert',
  initialState,
  reducers: {
    getOnlyUsersThatSharedContent: (state, action) => {
      let response = action.payload?.payload?.serviceResponseObject
      let usersThatSharedContent = []

      if (response?.length > 0) {
        response?.map((obj) => {
          let responseUser = obj?.userThatSharedContent
          let userThatShared = {
            id: responseUser?.id,
            username: responseUser?.username,
          }
          usersThatSharedContent.push(userThatShared)
        })
        state.usersThatSharedContent = usersThatSharedContent
      }
    },
    getSharedContentOfPickedUser: (state, action) => {
      let userId = action?.payload?.userId
      let response = action?.payload?.usersThatSharedIncludingItsContent
      let pickedObj = response.find(
        (u) => u?.userThatSharedContent?.id === userId
      )
      state.sharedContent = [...pickedObj.sharedContent]
    },
    setOverlayPost: (state, action) => {
      let contentPost = action?.payload
      if (contentPost !== null || contentPost !== undefined) {
        state.overlayPost = contentPost
      }
    },
    resetSharedContent: (state, action) => {
      state.sharedContent = action?.payload
      state.usersThatSharedIncludingItsContent = action?.payload
      state.usersThatSharedContent = action?.payload
    },
  },
  extraReducers: (builder) => {
    builder

      //experts
      .addCase(getMentalHealthExperts.pending, (state) => {
        state.isLoadingExperts = true
      })
      .addCase(getMentalHealthExperts.fulfilled, (state, action) => {
        state.isLoadingExperts = false
        state.dbMentalHealthExperts = action?.payload?.serviceResponseObject
        state.suggestedMentalHealthExperts =
          action?.payload?.serviceResponseObject
      })
      .addCase(getMentalHealthExperts.rejected, (state, action) => {
        state.isLoadingExperts = false
      })

      //shares-per-user
      .addCase(getSharesPerUser.pending, () => {})
      .addCase(getSharesPerUser.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode

        if (statusCode === 200) {
          state.usersThatSharedIncludingItsContent =
            action?.payload?.serviceResponseObject
        }
      })
      .addCase(getSharesPerUser.rejected, (action) => {})

      //give-assignment
      .addCase(createAssignment.pending, (state, action) => {})
      .addCase(createAssignment.fulfilled, (state, action) => {})
      .addCase(createAssignment.rejected, (state, action) => {})

      //users-with-set-assignments
      .addCase(getUsersWithSetAssignments.pending, (state, action) => {})
      .addCase(getUsersWithSetAssignments.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        let usersWithAssignments = action?.payload?.serviceResponseObject

        if (statusCode === 200 && usersWithAssignments?.length > 0) {
          state.usersWithSetAssignments = usersWithAssignments
        }
      })
      .addCase(getUsersWithSetAssignments.rejected, (state, action) => {})

      //invite/user
      .addCase(sendInviteToRegularUser.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(sendInviteToRegularUser.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(sendInviteToRegularUser.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  setOverlayPost,
  resetSharedContent,
} = mentalExpertSlice.actions
export default mentalExpertSlice.reducer
