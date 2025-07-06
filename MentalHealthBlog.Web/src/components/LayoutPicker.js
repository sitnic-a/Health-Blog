import { setActiveLayoutType, swap } from './utils/helper-methods/postHelper'

import { TbColumns2 } from 'react-icons/tb'
import { TbColumns1 } from 'react-icons/tb'

export const LayoutPicker = () => {
  let layoutPickerTypes = document.querySelector('.layout-picker-types')
  let layouts = document.querySelectorAll('.layout-type')

  layouts.forEach((layoutType) => {
    layoutType.addEventListener('click', function () {
      swap(this, layoutPickerTypes)
      setActiveLayoutType(this, layouts)
    })
  })

  return (
    <section id="layout-picker-main-container">
      <div className="layout-picker-container">
        <div className="layout-picker-types">
          <div
            className="layout-type two-columns-layout-container"
            onClick={(e) => {
              let mainContainers = document.querySelectorAll('.main-container')

              mainContainers.forEach((container) => {
                if (container.classList.contains('main-single-col')) {
                  container.classList.remove('main-single-col')
                }
                let postContainer = container.querySelector('.post-container')
                let postRevealActionContainers = container.querySelector(
                  '.post-reveal-action-containers'
                )
                let postTagsRevealActionContainer =
                  postRevealActionContainers.querySelector(
                    '.post-tags-reveal-action-container'
                  )
                let postOverlay = container.querySelector('.post-overlay')
                postContainer.classList.remove('post-container-single-col')
                postRevealActionContainers.classList.remove(
                  'post-reveal-action-containers-single-col'
                )
                postTagsRevealActionContainer.classList.remove(
                  'post-tags-reveal-action-container-single-col'
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
              let mainContainers = document.querySelectorAll('.main-container')
              mainContainers.forEach((container) => {
                container.classList.add('main-single-col')
                let postContainer = container.querySelector('.post-container')
                let postOverlay = container.querySelector('.post-overlay')
                let postRevealActionContainers = container.querySelector(
                  '.post-reveal-action-containers'
                )
                let postTagsRevealActionContainer =
                  postRevealActionContainers.querySelector(
                    '.post-tags-reveal-action-container'
                  )
                postContainer.classList.add('post-container-single-col')
                postRevealActionContainers.classList.add(
                  'post-reveal-action-containers-single-col'
                )
                postTagsRevealActionContainer.classList.add(
                  'post-tags-reveal-action-container-single-col'
                )
                postOverlay.classList.add('post-overlay-single-col')
              })
            }}
          >
            <TbColumns1 className="layout-view-icon" />
          </div>
        </div>
      </div>
    </section>
  )
}
