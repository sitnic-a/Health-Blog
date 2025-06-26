import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getSelectedPosts,
  getPeopleToShareContentWith,
} from '../../utils/helper-methods/methods'
import { setIsSharingExporting } from './postSlice'
import { application } from '../../../application'
import { toast } from 'react-toastify'

let initialState = {
  postsToShare: [],
  postsToExport: [],
  exportedDocument: null,
  isExported: null,
  possibleToShareWith: [],
  possibleToShareWithError: null,
  numberOfPeoplePossibleToShareWith: 0,
  isSharingLink: false,
  shareLinkUrl: '',
  isLoading: false,
}

export const exportToPDF = createAsyncThunk(
  '/export',
  async (objectWithData) => {
    console.log('Posts to export ', objectWithData.postsToExport)
    let request = await fetch(`${application.application_url}/export`, {
      method: 'POST',
      body: JSON.stringify(objectWithData.postsToExport),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })

    let response = request.json()

    return response
  }
)

export const shareByLink = createAsyncThunk(
  'share/link/{shareId}',
  async (objectWithData) => {
    let url = `${application.application_url}/share/link/${objectWithData.shareGuid}`
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

export const shareContent = createAsyncThunk(
  '/share',
  async (objectWithData) => {
    let request = await fetch(`${application.application_url}/share`, {
      method: 'POST',
      body: JSON.stringify(objectWithData.contentToBeShared),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })

    let response = request.json()
    return response
  }
)

export const getExpertsAndRelatives = createAsyncThunk(
  '/share/experts-relatives',
  async (objectWithData) => {
    let url = `${application.application_url}/share/experts-relatives`
    let request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${objectWithData.authenticatedUser.jwToken}`,
      },
    })
    let response = request.json()
    return response
  }
)

let shareExportSlice = createSlice({
  name: 'shareExportSlice',
  initialState,
  reducers: {
    setOverlayForShareExport: (state, action) => {
      let postsToShareExport = getSelectedPosts(action.payload)
      state.postsToExport = postsToShareExport

      // let main = document.querySelector("main");
      let shareExportBox = document.querySelector(
        '.share-export-main-container'
      )
      let selectDataButton = document.querySelector(
        "button[data-action-select='select']"
      )
      let uncheckReminder = document.querySelector('.reminder')

      if (state.postsToExport.length > 0) {
        uncheckReminder.style.opacity = '1'
        uncheckReminder.style.visibility = 'visible'
        selectDataButton.setAttribute('disabled', '')
        selectDataButton.style.cursor = 'not-allowed'

        // main.classList.add("selecting");
        if (shareExportBox.classList.contains('share-export-position-out')) {
          shareExportBox.classList.remove('share-export-position-out')
          shareExportBox.classList.add('share-export-position-in')
        }
        // let selecting = document.querySelector(".selecting");
        // selecting.style.opacity = "1";
      } else {
        uncheckReminder.style.opacity = '0'
        uncheckReminder.style.visibility = 'hidden'

        selectDataButton.removeAttribute('disabled')
        selectDataButton.style.cursor = 'pointer'
        // main.classList.remove("selecting");
        if (shareExportBox.classList.contains('share-export-position-in')) {
          shareExportBox.classList.remove('share-export-position-in')
          shareExportBox.classList.add('share-export-position-out')
        }
        setIsSharingExporting(false)
      }
    },

    revokeShareContent: (state, action) => {
      state.postsToExport = state.postsToExport.filter(
        (post) => post.id !== action.payload
      )
      toast.success('The post is removed from list to share  ', {
        autoClose: 2000,
        position: 'bottom-right',
      })
    },

    checkVisibilityOfShareContentAction: (state) => {
      if (getPeopleToShareContentWith().length > 0) {
        state.numberOfPeoplePossibleToShareWith =
          getPeopleToShareContentWith().length
        let shareBtn = document.querySelector('.share-btn-experts')
        shareBtn.style.display = 'inline-block'
      } else {
        state.numberOfPeoplePossibleToShareWith = 0
        let shareBtn = document.querySelector('.share-btn-experts')
        shareBtn.style.display = 'none'
      }
    },

    resetShareLinkUrl: (state) => {
      state.shareLinkUrl = ''
    },
  },
  extraReducers: (builder) => {
    builder
      //Export
      .addCase(exportToPDF.pending, (state) => {
        console.log('Pending')
        state.isLoading = true
      })
      .addCase(exportToPDF.fulfilled, (state, action) => {
        let fileLength = action?.payload?.fileLength
        if (fileLength > 0) {
          state.isExported = true
          state.exportedDocument = action.payload
          state.isLoading = false

          return
        }
        // state.isExported = false;
      })
      .addCase(exportToPDF.rejected, (state, action) => {
        state.isLoading = false
        console.log('FAILED')
        toast.error('Something went wrong', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      })

      .addCase(shareByLink.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(shareByLink.fulfilled, (state, action) => {
        state.postsToShare = action.payload.serviceResponseObject
        state.isLoading = false
      })
      .addCase(shareByLink.rejected, (state, action) => {
        state.isLoading = false
        toast.error('Something went wrong. Try again!', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      })

      //Share
      .addCase(shareContent.pending, (state, action) => {
        console.log('Pending...', action.meta)
        let contentToBeShared = action.meta.arg.contentToBeShared

        if (contentToBeShared.shareLink === true) {
          state.isSharingLink = true
        }
      })
      .addCase(shareContent.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode

        if (state.isSharingLink === true) {
          let sharedContent = action?.payload?.serviceResponseObject
          if (statusCode === 201) {
            if (sharedContent?.length > 0) {
              let shareId = sharedContent[0].shareGuid
              let host = window.location.origin
              state.shareLinkUrl = `${host}/share/link/${shareId}`
            }
            toast.success('You have succesfully shared content!', {
              autoClose: 2000,
              position: 'bottom-right',
            })
            return
          }
        }

        if (statusCode === 201) {
          toast.success('You have succesfully shared content!', {
            autoClose: 2000,
            position: 'bottom-right',
          })

          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      })

      .addCase(shareContent.rejected, () => {
        toast.error('Something went wrong. Try again!', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      })

      //get suggested experts or relatives
      .addCase(getExpertsAndRelatives.pending, (state, action) => {
        console.log('gEAR Pending...')
      })

      .addCase(getExpertsAndRelatives.fulfilled, (state, action) => {
        let statusCode = action?.payload?.statusCode
        state.possibleToShareWith = action.payload.serviceResponseObject
        if (statusCode !== 200) {
          state.possibleToShareWithError = action?.payload
          return
        }
      })

      .addCase(getExpertsAndRelatives.rejected, (state, action) => {
        state.possibleToShareWithError = action?.payload
        toast.error('Something went wrong. Try again!', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      })
  },
})

export const {
  setOverlayForShareExport,
  revokeShareContent,
  checkVisibilityOfShareContentAction,
  resetShareLinkUrl,
} = shareExportSlice.actions

export default shareExportSlice.reducer
