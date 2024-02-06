import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { application } from '../application'
import { useDispatch, useSelector } from 'react-redux'

import { openAddModal } from './redux-toolkit/features/modalSlice'

import { AddPost } from './AddPost'

import { MdOutlineAddCircleOutline } from 'react-icons/md'

export const ListOfPostsHeader = () => {
  let dispatch = useDispatch()
  let { isAddOpen } = useSelector((store) => store.modal)

  let location = useLocation()
  let [dbTags, setDbTags] = useState([])
  let url = `${application.application_url}/tag`

  useEffect(() => {
    let getAllTags = async (url) => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDbTags(data.serviceResponseObject)
          console.log(dbTags)
        })
    }
    getAllTags(url)
  }, [])

  let loggedUser = { ...location.state.loggedUser }
  return (
    <>
      {isAddOpen && <AddPost tags={dbTags} />}
      <section className="list-of-posts-header">
        <h1 className="list-of-posts-author">
          Written by: {loggedUser.username}
        </h1>
        <button
          data-action-add="add"
          type="button"
          onClick={() => dispatch(openAddModal(true))}
        >
          <MdOutlineAddCircleOutline />
          Add new post
        </button>
      </section>
    </>
  )
}
