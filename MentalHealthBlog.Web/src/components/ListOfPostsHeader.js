import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSharingExporting } from './redux-toolkit/features/postSlice'
import { setVisibility } from './redux-toolkit/features/filterSlice'
import { getTags } from './redux-toolkit/features/tagSlice'
import { openAddModal } from './redux-toolkit/features/modalSlice'
import { setActiveLayoutType, swap } from './utils/helper-methods/postHelper'

import { AddPost } from './AddPost'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { BiSelectMultiple } from 'react-icons/bi'
import { TbColumns3 } from 'react-icons/tb'
import { TbColumns2 } from 'react-icons/tb'
import { TbColumns1 } from 'react-icons/tb'

export const ListOfPostsHeader = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isAddOpen } = useSelector((store) => store.modal)
  let { isSharingExporting } = useSelector((store) => store.post)

  let layoutPickerTypes = document.querySelector('.layout-picker-types')
  let layouts = document.querySelectorAll('.layout-type')

  useEffect(() => {
    dispatch(getTags())
  }, [])

  layouts.forEach((layoutType) => {
    layoutType.addEventListener('click', function () {
      swap(this, layoutPickerTypes)
      setActiveLayoutType(this, layouts)
    })
  })

  return (
    <>
      {isAddOpen && <AddPost />}

      <section
        className="list-of-posts-header"
        onMouseOver={() => {
          let listPostsHeader = document.querySelector('.list-of-posts-header')
          listPostsHeader.style.marginBottom = '2rem'
        }}
        onMouseLeave={() => {
          let listPostsHeader = document.querySelector('.list-of-posts-header')
          listPostsHeader.style.marginBottom = '0'
        }}
      >
        <h1 className="list-of-posts-author">
          Written by: <span>{authenticatedUser.username}</span>
        </h1>
        <div className="header-actions">
          <button
            data-action-add="add"
            type="button"
            onClick={() => dispatch(openAddModal(true))}
          >
            <MdOutlineAddCircleOutline />
            Add new post
          </button>

          <button
            data-action-add="filter"
            type="button"
            onClick={() => {
              dispatch(setVisibility())
            }}
          >
            Filter
          </button>

          <section className="share-export" id="share-export-id">
            <div className="share-export-select">
              <button
                data-action-select="select"
                type="button"
                data-tooltip-title="Select data"
                onClick={(e) => {
                  dispatch(setIsSharingExporting(!isSharingExporting))
                }}
              >
                <BiSelectMultiple />
              </button>
            </div>
          </section>

          <section id="layout-picker-main-container">
            <div className="layout-picker-container">
              <div className="layout-picker-types">
                <div
                  className="layout-type two-columns-layout-container"
                  onClick={(e) => {
                    let mainContainers =
                      document.querySelectorAll('.main-container')

                    mainContainers.forEach((container) => {
                      if (container.classList.contains('main-single-col')) {
                        container.classList.remove('main-single-col')
                      }
                      let postContainer =
                        container.querySelector('.post-container')
                      let postOverlay = container.querySelector('.post-overlay')
                      postContainer.classList.remove(
                        'post-container-single-col'
                      )
                      postOverlay.classList.remove('post-overlay-single-col')
                    })
                  }}
                >
                  <TbColumns2 className="layout-view-icon" />
                </div>

                {/* <div
                  className="layout-type default-layout-container"
                  onClick={(e) => {
                    alert('Default')
                  }}
                >
                  <TbColumns3 className="layout-view-icon" />
                </div> */}

                <div
                  className="layout-type single-column-layout-container"
                  onClick={(e) => {
                    let mainContainers =
                      document.querySelectorAll('.main-container')
                    mainContainers.forEach((container) => {
                      container.classList.add('main-single-col')
                      let postContainer =
                        container.querySelector('.post-container')
                      let postOverlay = container.querySelector('.post-overlay')
                      let postRevealActionContainers = container.querySelector(
                        '.post-reveal-action-containers'
                      )
                      postContainer.classList.add('post-container-single-col')
                      postRevealActionContainers.style.marginInline = 'auto'
                      postOverlay.classList.add('post-overlay-single-col')
                    })
                  }}
                >
                  <TbColumns1 className="layout-view-icon" />
                </div>
              </div>
            </div>
          </section>
          <br />
        </div>
      </section>
    </>
  )
}
