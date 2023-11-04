import React from 'react'

//Import hooks
import { useEffect, useState } from 'react'

//Import custom configuration and data
import { application } from '../application'

//Import components
import { Post } from './Post'

export const ListOfPosts = () => {
  let url = `${application.application_url}/post`

  let [posts, setPosts] = useState([])
  useEffect(() => {
    let getPosts = async (url) => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => setPosts(data))
    }
    getPosts(url)
  }, [])

  return (
    <>
      <h1 className="list-of-posts-author">Written by: ...</h1>
      <section className="list-of-posts-main-container">
        {posts.map((post) => {
          return <Post key={post.id} {...post} />
        })}
      </section>
    </>
  )
}