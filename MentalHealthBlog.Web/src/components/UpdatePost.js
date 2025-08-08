import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getById, updatePost } from '../redux-toolkit/features/postSlice'

export const UpdatePost = () => {
  let { id } = useParams()
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { authenticatedUser } = useSelector((store) => store.user)
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
    let updatePostObj = {
      e,
      post,
      authenticatedUser,
    }
    console.log('Update post obj ', updatePostObj)
    dispatch(updatePost(updatePostObj)).then((data) => {
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
    <form onSubmit={update}>
      <section className="update-post-main-container">
        <h1 className="update-post-main-container-title"> Update post:</h1>
        <div className="update-post-main-container-header">
          <p className="update-post-main-container-header-title">
            New Title
            <span className="required-field"> *</span>
            <br />
            <input
              name="title"
              className="form-field update-post-main-container-header-post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              spellCheck={false}
            />
          </p>
        </div>

        <div className="update-post-main-container-content-container">
          <textarea
            className="update-post-main-container-content-value"
            name="content"
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          ></textarea>
        </div>
      </section>
      <button className="update-post-main-container-submit-btn" type="submit">
        Update post
      </button>
    </form>
  )
}
