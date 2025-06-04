import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { formatDateToString } from '../../utils/helper-methods/methods'
import { toast } from 'react-toastify'

export const ListOfSharedPosts = () => {
  let { postsToShare } = useSelector((store) => store.shareExport)

  useEffect(() => {
    toast.success('Content retrieved succesfully!', {
      position: 'bottom-right',
    })
  }, [])

  return (
    <section id="list-of-shared-posts-main-container">
      {postsToShare?.map((post, index) => {
        console.log('Post LS ', post)

        let date = formatDateToString(post.createdAt)
        let tags = post.tags
        let emotions = post?.emotions
        return (
          <div
            key={index}
            style={{
              marginBlock: '0.4rem',
              border: '1px solid lightgray',
              padding: '0.3rem',
              paddingBlock: '1.2rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 'fit-content',
                marginBottom: '1.5rem',
                paddingInline: '1.3rem',
                paddingBlock: '0.8rem',
                background: '#ffd870',
                borderRadius: '360px',
                fontSize: '1.1em',
              }}
            >
              {index + 1}
            </span>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <p>{date}</p>
            <div>
              <p>Your thoughts about:</p>
              <div>
                {tags.map((tag, index) => {
                  return <span key={index}>{tag} &nbsp;</span>
                })}
              </div>
            </div>
            {emotions?.length > 0 && (
              <div>
                <p>Emotions recognized:</p>
                <div>
                  {emotions.map((emotion, index) => {
                    return <span key={index}>{emotion.name} &nbsp;</span>
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
      <hr />
    </section>
  )
}
