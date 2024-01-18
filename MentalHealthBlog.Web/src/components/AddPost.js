import React, { useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

import { application } from '../application'
import { useLocation, useNavigate } from 'react-router'

const style = application.modal_style

export const AddPost = () => {
  let [modalOpened, setModalOpened] = useState(true)
  let navigate = useNavigate()
  let location = useLocation()
  let loggedUser = location.state.loggedUser

  let closeModal = () => setModalOpened(!modalOpened)

  let submitForm = async (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])

    let newPost = {
      title: data.title,
      content: data.content,
      userId: loggedUser.id,
    }

    if (
      newPost.title === '' ||
      newPost.title === null ||
      newPost.content === '' ||
      newPost.content === null
    ) {
      toast.error("Couldn't add the post", {
        autoClose: 1500,
        position: 'bottom-right',
      })
      return
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
        toast.success('New post succesfully added', {
          autoClose: 1500,
          position: 'bottom-right',
        })
        closeModal()
      } else {
        console.log('Some error occured')
        toast.error("Couldn't add the post", {
          autoClose: 1500,
          position: 'bottom-right',
        })
        closeModal()
      }
    } catch (error) {
      console.log(error)
      toast.error("Couldn't add the post", {
        autoClose: 1500,
        position: 'bottom-right',
      })
      closeModal()
    }

    console.log('Form submitted')
    window.location.reload()
  }

  return (
    <Modal
      isOpen={modalOpened}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={closeModal}
    >
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
    </Modal>
  )
}
