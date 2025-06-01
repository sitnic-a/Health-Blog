import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openAddModal } from './redux-toolkit/features/modalSlice'
import { createPost } from './redux-toolkit/features/postSlice'
import {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
  getTags,
} from './redux-toolkit/features/tagSlice'
import { getEmotions } from './redux-toolkit/features/emotionSlice'

import Modal from 'react-modal'
import { application } from '../application'
import { TagsOnPostCreation } from './TagsOnPostCreation'

export const AddPost = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isAddOpen } = useSelector((store) => store.modal)
  let { chosenTags } = useSelector((store) => store.tag)
  let { pickedEmotions } = useSelector((store) => store.emotion)

  useEffect(() => {
    dispatch(getTags())
    dispatch(getEmotions())
  }, [])

  let submitForm = (e) => {
    let chosenEmotions = pickedEmotions.map((emotion) => emotion.id)
    let addPostObj = {
      e,
      authenticatedUser,
      chosenTags,
      chosenEmotions,
    }
    dispatch(createPost(addPostObj))
    dispatch(openAddModal(false))
  }

  return (
    <Modal
      isOpen={isAddOpen}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => {
        dispatch(openAddModal(false))
        dispatch(setSuggestedTags([]))
        dispatch(setDisplayedSuggestedTags([]))
        dispatch(setChosenTags([]))
        dispatch(setPickedTags([]))
      }}
    >
      <form
        onSubmit={submitForm}
        id="add-post-form"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.localName === 'textarea') {
            return
          } else if (e.key === 'Enter' && e.target.localName === 'input') {
            e.preventDefault()
          }
        }}
      >
        <div className="add-post-modal-header">
          <h2>Post</h2>
        </div>
        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label htmlFor="title">
              Title
              <span className="required-field"> *</span>
            </label>
            <br />
            <input
              className="add-post-title-input"
              type="text"
              id="title"
              name="title"
            />
          </div>
          <div className="add-post-content-container">
            <label htmlFor="content">
              Content
              <span className="required-field"> *</span>
            </label>
            <br />
            <textarea
              className="add-post-content-textarea"
              name="content"
              id="content"
              rows="10"
              spellCheck={false}
            ></textarea>
          </div>

          <TagsOnPostCreation />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  )
}
