import postApi from './api/postApi'
import { setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return
  // find and clone template (tìm và sao chép template)
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return
  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title, author , description , thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))

  // calculate timespan (tính toán khoảng thời gian)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Error'
    })
  }
  // attach events (đính kèm các sự kiện)

  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElment = createPostElement(post)
    ulElement.appendChild(liElment)
  })
}

function initPagination() {
  //bind click event for prev/next link ( ràng buộc sự kiện nhấp chuột cho liên kết prev/next link )
  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return

  // add click event for prev link (thêm sự kiện nhấp chuột cho prev )
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  // add click event for prev link (thêm sự kiện nhấp chuột cho prev )
  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('prev')
}

function handleNextClick(e) {
  e.preventDefault()
  console.log('next')
}

function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  history.pushState({}, '', url)

  // gọi lại API
  // render post list
}

function initURL() {
  const url = new URL(window.location)

  // update search params if needed ( cập nhật thông số tìm kiếm nếu cần)
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}
;(async () => {
  try {
    initPagination()
    initURL()

    const queryParams = new URLSearchParams(window.location.search)
    console.log(new URLSearchParams(window.location.search))
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
