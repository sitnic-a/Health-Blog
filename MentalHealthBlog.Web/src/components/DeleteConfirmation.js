import React from 'react'
import { useState } from 'react'
import Modal from 'react-modal'
import { application } from '../application'

export const DeleteConfirmation = (props) => {
  let [openModal, setOpenModal] = useState(props.modalState)
  let deletePost = async (id) => {
    let request = await fetch(`${application.application_url}/post/${id}`, {
      method: 'DELETE',
    })
    let data = await request.json()
    window.location.reload()
  }
  return (
    <Modal
      isOpen={openModal}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => setOpenModal(!openModal)}
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
            onClick={(e) => {
              setOpenModal(!openModal)
              props.changeModalState(true)
            }}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  )
}
