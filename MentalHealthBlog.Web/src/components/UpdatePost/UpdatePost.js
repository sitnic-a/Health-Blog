import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { getById, updatePost } from '../../redux-toolkit/features/postSlice'
import {
  setTitleValidationData,
  setContentValidationData,
} from '../../redux-toolkit/features/validationSlice'

import {
  checkInputDataValidity,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'

import UpdatePostCSS from './UpdatePost.css'

export const UpdatePost = () => {
  let { id } = useParams()
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { authenticatedUser } = useSelector((store) => store.user)
  let { titleValidationData, contentValidationData } = useSelector(
    (store) => store.validation
  )
  let { post } = useSelector((store) => store.post)
  let [title, setTitle] = useState(post?.title)
  let [content, setContent] = useState(post?.content)

  useEffect(() => {
    let requestObject = {
      postId: id,
      authenticatedUser,
    }
    dispatch(getById(requestObject)).then((data) => {
      let post = data?.payload?.serviceResponseObject
      let statusCode = data?.payload?.StatusCode

      if (statusCode !== 200) {
        if (statusCode === 404) {
          navigate('/not-found')
        }
      }
      setTitle(post?.title)
      setContent(post?.content)
    })
  }, [])

  let update = async (e) => {
    e.preventDefault()

    let updatePostObj = {
      e,
      post,
      authenticatedUser,
    }

    let form = new FormData(updatePostObj.e.target)
    let formEntries = [...form.entries()]
    let formObject = Object.fromEntries(formEntries)

    let objectWithData = {
      title: formObject?.title,
      content: formObject?.content,
      userId: updatePostObj?.post?.userId,
      authenticatedUser,
      post,
    }

    if (
      stringIsNullOrEmpty(objectWithData?.title) ||
      !titleValidationData?.titleIsValid ||
      stringIsNullOrEmpty(objectWithData?.content) ||
      !contentValidationData?.contentIsValid ||
      objectWithData?.userId <= 0
    ) {
      toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    dispatch(updatePost(objectWithData)).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode === 200) {
        navigate('/', {
          state: {
            prevUrl: window.location.href,
          },
        })
      }
    })
  }

  return (
    <form className="update-post-form" onSubmit={update}>
      <section className="update-post-main-container">
        <h1 className="update-post-main-container-title"> Uredi post:</h1>
        <div className="update-post-main-container-header">
          <p className="update-post-main-container-header-title">
            Novi naslov
            <span className="required-field"> *</span>
            <br />
            <input
              name="title"
              className="form-field update-post-main-container-header-post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              spellCheck={false}
            />
          </p>

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

        <div className="update-post-main-container-content-container">
          <textarea
            className="form-field update-post-main-container-content-value"
            name="content"
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
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
      </section>
      <button className="update-post-main-container-submit-btn" type="submit">
        Snimi promjene
      </button>
    </form>
  )
}
