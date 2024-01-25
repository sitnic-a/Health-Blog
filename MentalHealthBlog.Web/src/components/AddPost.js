import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

import { application } from '../application'
import { useLocation, useNavigate } from 'react-router'

const style = application.modal_style

export const AddPost = (props) => {
  let [modalOpened, setModalOpened] = useState(true)
  let [chosenTags, setChosenTags] = useState([])
  let [suggestedTags, setSuggestedTags] = useState(props.tags)
  let [displayedSuggestedTags, setDisplayedSuggestedTags] = useState([])
  let navigate = useNavigate()
  let location = useLocation()
  let loggedUser = location.state.loggedUser

  let closeModal = () => setModalOpened(!modalOpened)

  let handleTagAdding = (e) => {
    if (e.key === 'Enter') {
      let tag = e.target.value
      setChosenTags((currentState) => {
        let newArray = [...currentState, tag]
        console.log(newArray)
        return newArray
      })
      e.target.value = ''
      return
    }
  }

  let handleTagRemoval = (tag) => {
    setChosenTags((currentState) => {
      let newArray = [...currentState].filter((t) => t !== tag)
      console.log(newArray)
      return newArray
    })
    console.log(chosenTags)
  }

  let handleSuggestedTagsChange = (e) => {
    if (e.target.value === '') {
      setSuggestedTags(props.tags)
      setDisplayedSuggestedTags([])
      return
    }
    let onInputTags = suggestedTags.filter((t) =>
      t.name.includes(e.target.value)
    )
    setDisplayedSuggestedTags(onInputTags)
  }

  let submitForm = async (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])

    let newPost = {
      title: data.title,
      content: data.content,
      userId: loggedUser.id,
      tags: chosenTags,
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
      <form
        onSubmit={submitForm}
        id="add-post-form"
        onKeyDown={(e) => {
          e.key === 'Enter' && e.preventDefault()
        }}
      >
        <div className="add-post-modal-header">
          <h2>Post</h2>
        </div>
        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label htmlFor="title">Title</label>
            <br />
            <input
              className="add-post-title-input"
              type="text"
              id="title"
              name="title"
            />
          </div>
          <div className="add-post-content-container">
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              className="add-post-content-textarea"
              name="content"
              id="content"
              rows="10"
            ></textarea>
          </div>
          <div className="add-post-picked-tags-container">
            {chosenTags.map((tag) => {
              return (
                <span
                  key={tag}
                  className="add-post-content-picked-tags-span-tag"
                >
                  {tag}
                  <span
                    className="add-post-content-picked-tags-span-tag-remove"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    X
                  </span>
                </span>
              )
            })}
          </div>
          <div className="add-post-tags-container">
            <label htmlFor="tag">Tags</label>
            <br />
            <input
              name="tags"
              id="tag"
              type="text"
              className="add-post-content-tags-input"
              onKeyUp={(e) => handleTagAdding(e)}
              onChange={(e) => handleSuggestedTagsChange(e)}
            />
          </div>
          {displayedSuggestedTags.length > 0 && (
            <div
              id="add-post-suggested-tags-container-id"
              className="add-post-suggested-tags-container"
            >
              {displayedSuggestedTags.map((tag) => {
                return (
                  <div className="add-post-suggested-tag" key={tag.id}>
                    {tag.name}
                  </div>
                )
              })}
            </div>
          )}
          <br />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  )
}
