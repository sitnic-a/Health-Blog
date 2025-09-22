import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { shareByLink } from '../../redux-toolkit/features/shareExportSlice'
import { ListOfSharedPosts } from '../share-export/share/ListOfSharedPosts/ListOfSharedPosts'
import { useNavigate } from 'react-router-dom'

import SharedContentPostsViaLinkCSS from './SharedContentPostsViaLink.css'

export const SharedContentPostsViaLink = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { postsToShare } = useSelector((store) => store.shareExport)

  useEffect(() => {
    let url = window.location.href
    if (url.includes('share/link')) {
      let urlParts = url.split('/')
      let shareGuid = urlParts[urlParts.length - 1]

      let objectWithData = {
        shareGuid,
      }

      dispatch(shareByLink(objectWithData)).then((data) => {
        let statusCode = data?.payload?.StatusCode
        if (statusCode !== 200) {
          if (statusCode === 400 || statusCode === 404) {
            navigate('not-found')
          }
          return
        }
      })
    }
  }, [])

  return (
    postsToShare !== null &&
    postsToShare?.length > 0 && (
      <section id="user-shared-posts-via-link">
        <h1 className="user-shared-posts-via-link-title">Sadržaj:</h1>
        <ListOfSharedPosts />
      </section>
    )
  )
}
