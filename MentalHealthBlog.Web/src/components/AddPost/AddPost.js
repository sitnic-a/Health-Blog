import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { openAddModal } from '../../redux-toolkit/features/modalSlice'
import { createPost } from '../../redux-toolkit/features/postSlice'
import {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
  getTags,
} from '../../redux-toolkit/features/tagSlice'
import { getEmotions } from '../../redux-toolkit/features/emotionSlice'
import {
  setContentValidationData,
  setTagsValidationData,
  setTitleValidationData,
} from '../../redux-toolkit/features/validationSlice'
import {
  checkInputDataValidity,
  checkTagsValidity,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'

import Modal from 'react-modal'
import { application } from '../../application'
import { AddPostTags } from '../AddPostTags/AddPostTags'

import AddPostCSS from './AddPost.css'

export const AddPost = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isAddOpen } = useSelector((store) => store.modal)
  let { chosenTags } = useSelector((store) => store.tag)
  let { pickedEmotions } = useSelector((store) => store.emotion)
  let { titleValidationData, contentValidationData, tagsValidationData } =
    useSelector((store) => store.validation)

  useEffect(() => {
    dispatch(getTags())
    dispatch(getEmotions())
  }, [])

  let submitForm = (e) => {
    e.preventDefault()
    let chosenEmotions = pickedEmotions?.map((emotion) => emotion.id)

    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])

    let objectWithData = {
      title: data?.title,
      content: data?.content,
      authenticatedUser,
      userId: authenticatedUser?.id,
      tags: chosenTags,
      emotions: chosenEmotions,
    }

    let isTitle = true
    let isContent = false
    let [titleIsValid, titleValidationMessages] = checkInputDataValidity(
      objectWithData?.title,
      [],
      isTitle,
      isContent
    )
    dispatch(setTitleValidationData({ titleIsValid, titleValidationMessages }))

    isTitle = false
    isContent = true
    let [contentIsValid, contentValidationMessages] = checkInputDataValidity(
      objectWithData?.content,
      [],
      isTitle,
      isContent
    )

    dispatch(
      setContentValidationData({ contentIsValid, contentValidationMessages })
    )

    let [tagsIsValid, tagsValidationMessages] = checkTagsValidity(
      objectWithData?.tags,
      []
    )
    dispatch(setTagsValidationData({ tagsIsValid, tagsValidationMessages }))

    if (
      stringIsNullOrEmpty(objectWithData?.title) ||
      !titleValidationData?.titleIsValid ||
      stringIsNullOrEmpty(objectWithData?.content) ||
      !contentValidationData?.contentIsValid ||
      objectWithData?.tags?.length <= 0 ||
      !tagsValidationData?.tagsIsValid
    ) {
      toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    dispatch(createPost(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode

      if (statusCode !== null || statusCode !== undefined) {
        if (statusCode !== 201) {
          if (statusCode === 400) {
            toast.error('Podaci ili nisu ispravni ili nisu unešeni', {
              autoClose: 3000,
              position: 'bottom-right',
            })
            return
          }
          if (statusCode === 404) {
            toast.error('Post nije uspješno kreiran!', {
              autoClose: 3000,
              position: 'bottom-right',
            })
            return
          }
        } else {
          dispatch(openAddModal(false))
        }
      }
    })
  }

  return (
    <Modal
      isOpen={isAddOpen}
      style={application.add_post_modal_style}
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

        <span className="required-field">Polja obavezna za unos *</span>

        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label className="add-post-form-field-label" htmlFor="title">
              Naslov
              <span className="required-field"> *</span>
            </label>
            <br />
            <input
              className="add-post-title-input form-field"
              type="text"
              id="title"
              name="title"
              placeholder="Unesite naziv posta..."
              onBlur={(e) => {
                let title = e.target.value
                let isTitle = true
                let isContent = false
                let [isValid, validationMessages] = checkInputDataValidity(
                  title,
                  [],
                  isTitle,
                  isContent
                )

                dispatch(
                  setTitleValidationData({
                    titleIsValid: isValid,
                    titleValidationMessages: validationMessages,
                  })
                )
              }}
            />

            {!titleValidationData?.titleIsValid && (
              <div className="validation-message-main-container">
                {titleValidationData?.titleValidationMessages?.map(
                  (message, index) => {
                    return (
                      <p key={index} className="validation-message">
                        - {message}
                      </p>
                    )
                  }
                )}
              </div>
            )}
          </div>
          <div className="add-post-content-container">
            <label className="add-post-form-field-label" htmlFor="content">
              Sadržaj
              <span className="required-field"> *</span>
            </label>
            <br />
            <textarea
              className="add-post-content-textarea form-field"
              name="content"
              id="content"
              rows="10"
              spellCheck={false}
              placeholder="Unesite sadržaj posta..."
              onBlur={(e) => {
                let content = e.target.value
                let isTitle = false
                let isContent = true
                let [isValid, validationMessages] = checkInputDataValidity(
                  content,
                  [],
                  isTitle,
                  isContent
                )

                dispatch(
                  setContentValidationData({
                    contentIsValid: isValid,
                    contentValidationMessages: validationMessages,
                  })
                )
              }}
            ></textarea>

            {!contentValidationData?.contentIsValid && (
              <div className="validation-message-main-container">
                {contentValidationData?.contentValidationMessages?.map(
                  (message, index) => {
                    return (
                      <p key={index} className="validation-message">
                        - {message}
                      </p>
                    )
                  }
                )}
              </div>
            )}
          </div>

          <AddPostTags />
        </div>
        <button type="submit" className="add-post-modal-save-button">
          Snimi
        </button>
      </form>
    </Modal>
  )
}
