import postApi from './api/postApi'
import { getUlPagination, setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'
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

  // clear curent list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElment = createPostElement(post)
    ulElement.appendChild(liElment)
  })
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination || !ulPagination) return

  //calc totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  //seve page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable / disabled prev  links
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')
  // check if enable / disabled  next links
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

function initPagination() {
  //bind click event for prev/next link ( ràng buộc sự kiện nhấp chuột cho liên kết prev/next link )
  const ulPagination = getUlPagination()
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

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    // gọi lại API
    // render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {}
}

function initURL() {
  const url = new URL(window.location)

  // update search params if needed ( cập nhật thông số tìm kiếm nếu cần)
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return

  // set Default values from query params (đặt các giá trị Mặc định từ các tham số truy vấn)
  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    // attach click event for links (đính kèm sự kiện nhấp chuột cho các liên kết)
    initPagination()
    initSearch()

    // set default pagination
    initURL()

    // render post list based URL params
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
