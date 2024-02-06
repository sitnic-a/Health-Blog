import React, { useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

import { application } from '../application'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { openAddModal } from './redux-toolkit/features/modalSlice'

export const AddPost = (props) => {
  let dispatch = useDispatch()
  let { isAddOpen } = useSelector((store) => store.modal)

  let [chosenTags, setChosenTags] = useState([])
  let [suggestedTags, setSuggestedTags] = useState(props.tags)
  let [displayedSuggestedTags, setDisplayedSuggestedTags] = useState([])
  let [pickedTags, setPickedTags] = useState([])

  let navigate = useNavigate()
  let location = useLocation()
  let loggedUser = location.state.loggedUser

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

  let handleTagRemoval = (tagName) => {
    let dbTags = [...props.tags]
    let tag = dbTags.find((t) => t.name === tagName)
    setPickedTags((currentState) => {
      let updatedSuggestedTags = [...suggestedTags, tag]
      currentState = [...currentState].filter((t) => t.id !== tag.id)
      updatedSuggestedTags = [...updatedSuggestedTags].filter(
        (t) => !currentState.includes(t)
      )
      setSuggestedTags(updatedSuggestedTags)
      return currentState
    })
    setChosenTags((currentState) => {
      let newArray = [...currentState].filter((t) => t !== tagName)
      console.log(newArray)
      return newArray
    })
    console.log(chosenTags)
  }

  let handleSuggestedTagsChange = (e) => {
    if (e.target.value === '') {
      if (pickedTags.length > 0) {
        setSuggestedTags((currentState) => {
          currentState = currentState
            .filter((t) => !pickedTags.includes(t))
            .filter((t) => t.name !== e.target.value)
          return currentState
        })
        //console.log("New suggested", suggestedTags);

        setDisplayedSuggestedTags([])
        return
      }
      setSuggestedTags(props.tags)
      setDisplayedSuggestedTags([])
      return
    }

    let onInputTags = suggestedTags
      .filter((t) => t.name.includes(e.target.value))
      .filter((t) => !pickedTags.includes(t))
    setDisplayedSuggestedTags(onInputTags)
  }

  let handlePickedTagClick = (tag) => {
    document.querySelector('#tag').value = ''
    let suggestedTagsAfterClick = [...suggestedTags].filter(
      (t) => t.id !== tag.id
    )
    setSuggestedTags(suggestedTagsAfterClick)
    setDisplayedSuggestedTags([])

    setChosenTags((currentState) => {
      currentState = [...currentState, tag.name]
      setPickedTags([...pickedTags, tag])
      return currentState
    })
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
        dispatch(openAddModal(false))
      } else {
        console.log('Some error occured')
        toast.error("Couldn't add the post", {
          autoClose: 1500,
          position: 'bottom-right',
        })
        dispatch(openAddModal(false))
      }
    } catch (error) {
      console.log(error)
      toast.error("Couldn't add the post", {
        autoClose: 1500,
        position: 'bottom-right',
      })
      dispatch(openAddModal(false))
    }

    console.log('Form submitted')
    window.location.reload()
  }

  return (
    <Modal
      isOpen={isAddOpen}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => dispatch(openAddModal(false))}
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
                  <div
                    className="add-post-suggested-tag"
                    key={tag.id}
                    onClick={() => handlePickedTagClick(tag)}
                  >
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
