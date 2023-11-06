import React, { useState } from 'react'
import Modal from 'react-modal'
import axios from 'react-axios'

import { application } from '../application'

const style = application.modal_style

export const AddPost = () => {
  let [modalOpened, setModalOpened] = useState(true)
  let closeModal = () => setModalOpened(!modalOpened)

  let submitForm = async (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])

    let newPost = {
      title: data.title,
      content: data.content,
      userId: 1,
    }

    console.log(newPost)

    try {
      let response = await fetch(`${application.application_url}/post`, {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      let responseJson = await response.json()
      if (response.status === 200) {
        alert('Added new post')
        closeModal()
      } else {
        console.log('Some error occured')
        closeModal()
      }
    } catch (error) {
      console.log(error)
      closeModal()
    }

    console.log('Form submitted')
    window.location.reload()
  }

  return (
    <dialog id="modal" open role="dialog">
      <form onSubmit={submitForm} id="add-post-form">
        <div className="add-post-modal-header">
          <h2>Post</h2>
        </div>
        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label htmlFor="title">Title</label>
            <br />
            <input type="text" id="title" name="title" />
          </div>
          <div className="add-post-content-container">
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </dialog>
  )
}
