import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts } from '../../redux-toolkit/features/postSlice'
import { toast } from 'react-toastify'

import { Post } from '../Post/Post'
import { ListOfPostsHeader } from '../ListOfPostsHeader/ListOfPostsHeader'
import { Loader } from '../shared/Loader/Loader'
import { PieGraph } from '../PieGraph/PieGraph'

import { ListOfPostsFilterOptions } from '../ListOfPostsFilterOptions/ListOfPostsFilterOptions'

import { ShareExportOverlay } from '../share-export/share/ShareExportOverlay/ShareExportOverlay'
import { ShareModal } from '../share-export/share/ShareModal/ShareModal'
import { ExportModal } from '../share-export/export/ExportModal/ExportModal'
import { setIsReviewingState } from '../../redux-toolkit/features/regularUserSlice'
import { DeletePostConfirmation } from '../DeletePostConfirmation/DeletePostConfirmation'

import ListOfPostsCSS from './ListOfPosts.css'

export const ListOfPosts = () => {
  let dispatch = useDispatch()
  let { isLoading, posts } = useSelector((store) => store.post)
  let { authenticatedUser, isLogging } = useSelector((store) => store.user)
  let { statisticsLoading } = useSelector((store) => store.pie)
  let { isDeleteOpen } = useSelector((store) => store.modal)
  let searchPostDto = {
    authenticatedUser,
    monthOfPostCreation: 0,
  }

  useEffect(() => {
    dispatch(getPosts(searchPostDto)).then((data) => {
      dispatch(setIsReviewingState(false))
      let statusCode = data?.payload?.statusCode

      if (statusCode !== 200) {
        toast.error("Posts aren't fetched properly!", {
          autoClose: 1500,
          position: 'bottom-right',
        })
        return
      }

      if (
        data?.payload?.statusCode === 200 &&
        data?.payload?.serviceResponseObject?.length === 0
      ) {
        toast.warning('Currently, no posts to retrieve', {
          position: 'bottom-right',
        })
        return
      }

      toast.success('Posts fetched properly!', {
        autoClose: 1500,
        position: 'bottom-right',
      })
    })
  }, [])

  if (isLoading && isLogging && statisticsLoading) {
    ;<Loader />
  }

  return (
    <>
      <ListOfPostsHeader />
      <ShareModal />
      <ExportModal />

      <ShareExportOverlay />
      <div className="reminder">
        <p className="unselect-data-reminder">
          IMPORTANT: Uncheck all selected post if you want to exit share/export
          mode!!
        </p>
      </div>

      <ListOfPostsFilterOptions searchPostDto={searchPostDto} />

      <div className="dashboard-cols">
        <section className="list-of-posts-main-container">
          {isDeleteOpen && <DeletePostConfirmation />}
          {posts.map((post) => {
            return <Post key={post.id} post={post} />
          })}
        </section>

        <section className="pie-graph-main-container">
          <PieGraph searchPostDto={searchPostDto} />
        </section>
      </div>
    </>
  )
}
