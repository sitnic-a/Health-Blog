import React, { useState } from 'react'

import { MdOutlineModeEditOutline, MdOutlineDelete } from 'react-icons/md'
import { DeleteConfirmation } from './DeleteConfirmation'

export const Post = (props) => {
  let dbObject = { ...props }
  let [openModal, setOpenModal] = useState(false)
  let changeModalState = (currentState) => {
    return !currentState
  }

  return (
    <div className="main-container">
      <section className="post-container" onClick={() => alert('Get/{id}')}>
        <section className="post-container-content">
          <div className="post-header">
            <h1>{props.title}</h1>
          </div>
          <div className="post-information">
            <textarea
              className="post-content"
              name="content"
              cols={30}
              rows={13}
              value={props.content}
              disabled={true}
            ></textarea>
          </div>
        </section>
      </section>
      <div className="overlay-mask">
        <button data-action-update="update" type="button">
          <MdOutlineModeEditOutline onClick={() => alert('Edit/{id}')} />
        </button>
        <button data-action-delete="delete" type="button">
          <MdOutlineDelete onClick={() => setOpenModal(!openModal)} />
          {openModal && (
            <DeleteConfirmation
              {...props}
              modalState={openModal}
              changeModalState={changeModalState}
            />
          )}
        </button>
      </div>
    </div>
  )
}
