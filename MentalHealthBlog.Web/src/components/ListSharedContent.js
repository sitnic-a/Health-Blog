import React from 'react'

export const ListSharedContent = (props) => {
  let sharedContent = [...props.sharedContent]
  return (
    <section className="sharing-users-content-container">
      <h1>Shared content</h1>

      <div className="sharing-users-posts">
        {sharedContent.length > 0 &&
          sharedContent.map((content) => {
            return (
              <div className="sharing-users-post-container" key={content.id}>
                <div className="sharing-users-post-title">
                  <h2>{content.title}</h2>
                </div>

                <div className="sharing-users-post-content">
                  <p>{content.content}</p>
                </div>

                <div className="sharing-users-post-tags">
                  {content.tags.map((tag) => {
                    return <span key={tag}>{tag}</span>
                  })}
                </div>
              </div>
            )
          })}
      </div>
    </section>
  )
}
