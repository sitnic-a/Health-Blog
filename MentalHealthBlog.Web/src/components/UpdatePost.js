import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getById, updatePost } from './redux-toolkit/features/postSlice'

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
    dispatch(updatePost(updatePostObj)).then(() => {
      navigate('/', {
        state: {
          prevUrl: window.location.href,
        },
      })
    })
  }

  return (
    <form onSubmit={update}>
      <article className="post-by-id-container-edit">
        <h1> Update post:</h1>
        <div>
          <p>
            New Title
            <span className="required-field"> *</span>
            <input
              name="title"
              className="post-by-id-container-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </p>
        </div>

        <div>
          <textarea
            className="post-by-id-container-edit-textarea"
            name="content"
            cols={70}
            rows={30}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
      </article>
      <button className="post-by-id-container-edit-submit-button" type="submit">
        Update post
      </button>
    </form>
  )
}
