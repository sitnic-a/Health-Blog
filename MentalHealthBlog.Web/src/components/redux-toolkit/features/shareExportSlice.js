import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSelectedPosts } from '../../utils/helper-methods/methods'
import { setIsSharingExporting } from './postSlice'
import { application } from '../../../application'
import { act } from 'react'
import { toast } from 'react-toastify'

let initialState = {
  postsToShare: [],
  postsToExport: [],
  exportedDocument: null,
  isExported: false,
  possibleToShareWith: [],
}

export const exportToPDF = createAsyncThunk(
  '/export',
  async (postsToExport) => {
    console.log('Posts to export ', postsToExport)
    let request = await fetch(`${application.application_url}/export`, {
      method: 'POST',
      body: JSON.stringify(postsToExport),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let response = request.json()
    return response
  }
)

export const shareContent = createAsyncThunk(
  '/share',
  async (contentToBeShared) => {
    console.log('Content to be shared ', contentToBeShared)

    let request = await fetch(`${application.application_url}/share`, {
      method: 'POST',
      body: JSON.stringify(contentToBeShared),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let response = request.json()
    return response
  }
)

export const getExpertsAndRelatives = createAsyncThunk(
  '/share/experts-relatives',
  async () => {
    console.log('Get expert and relatives users invoked...')
    let url = `${application.application_url}/share/experts-relatives`
    let request = await fetch(url)
    let response = request.json()
    console.log('Response in slice ', response)

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

      let main = document.querySelector('main')
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

        main.classList.add('selecting')
        if (shareExportBox.classList.contains('share-export-position-out')) {
          shareExportBox.classList.remove('share-export-position-out')
          shareExportBox.classList.add('share-export-position-in')
        }
        let selecting = document.querySelector('.selecting')
        selecting.style.opacity = '1'
      } else {
        uncheckReminder.style.opacity = '0'
        uncheckReminder.style.visibility = 'hidden'

        selectDataButton.removeAttribute('disabled')
        selectDataButton.style.cursor = 'pointer'
        main.classList.remove('selecting')
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
  },
  extraReducers: (builder) => {
    builder
      //Export
      .addCase(exportToPDF.pending, (state) => {
        console.log('Pending')
      })
      .addCase(exportToPDF.fulfilled, (state, action) => {
        console.log('Successfully implemented')
        state.isExported = true
        console.log('Payload ---- ', action.payload)

        state.exportedDocument = action.payload
      })
      .addCase(exportToPDF.rejected, (state, action) => {
        console.log('FAILED')
      })

      //Share
      .addCase(shareContent.pending, (state, action) => {
        console.log('Pending...')
      })
      .addCase(shareContent.fulfilled, (state, action) => {
        toast.success('You have succesfully shared content!', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      })
      .addCase(shareContent.rejected, () => {
        toast.error('Something went wrong. Try again!', {
          autoClose: 2000,
          position: 'bottom-right',
        })
      })

      //get suggested experts or relatives
      .addCase(getExpertsAndRelatives.pending, (state, action) => {
        console.log('Started with get experts and relatives...')
      })
      .addCase(getExpertsAndRelatives.fulfilled, (state, action) => {
        console.log('Get experts and relatives succesfully finished')
        console.log('Case gER payload ', action.payload)
        state.possibleToShareWith = action.payload
      })
      .addCase(getExpertsAndRelatives.rejected, (state, action) => {
        console.log('Get experts and relatives rejected')
      })
  },
})

export const { setOverlayForShareExport, revokeShareContent } =
  shareExportSlice.actions

export default shareExportSlice.reducer
