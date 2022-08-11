import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'
dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return
  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title , description , author ,thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title)

  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author
  setTextContent(liElement, '[data-id="author"]', post.author)

  // calculate timsepan (tính toán khoảng thời gian)

  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=error'
    })
  }

  // attach events
  // go to post detail
  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // if event is triggered from menu ---> ignore
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(event.target)) return
      console.log('parent click')
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      console.log('edit click')
      // prevent event bubbling to parent
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  return liElement
}

export function renderPostList(elementID, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementID)
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  for (const post of postList) {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  }
}
