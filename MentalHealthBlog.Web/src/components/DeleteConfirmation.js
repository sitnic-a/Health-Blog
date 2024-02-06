import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { application } from '../application'

import { openDeleteModal } from './redux-toolkit/features/modalSlice'

export const DeleteConfirmation = (props) => {
  let dispatch = useDispatch()
  let { isDeleteOpen } = useSelector((store) => store.modal)

  let deletePost = async (id) => {
    let request = await fetch(`${application.application_url}/post/${id}`, {
      method: 'DELETE',
    })
    let data = await request.json()
    window.location.reload()
  }

  return (
    <Modal
      isOpen={isDeleteOpen}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => dispatch(openDeleteModal(false))}
    >
      <div className="confirmation-container">
        <div className="confirmation-title">
          <h2>Are you sure you want to delete this post?</h2>
        </div>
        <div className="confirmation-actions">
          <button type="button" onClick={() => deletePost(props.id)}>
            Yes
          </button>
          <button
            type="button"
            onClick={() => dispatch(openDeleteModal(false))}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  )
}
