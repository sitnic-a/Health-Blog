import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { application } from '../application'

export const PostById = () => {
  let [post, setPost] = useState({})
  let { id } = useParams()
  let fetchPost = async () => {
    try {
      let postResponse = await fetch(
        `${application.application_url}/post/${id}`
      ).then((response) => response.json())
      setPost(postResponse)
    } catch (error) {
      console.log(error.name)
    }
  }
  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Written by: [name] {post.userId}</p>
      <div>{post.content}</div>
    </article>
  )
}
