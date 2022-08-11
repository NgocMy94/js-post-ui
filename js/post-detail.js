import dayjs from 'dayjs'
import postApi from './api/postApi'
import { registerLigthBox, setTextContent } from './utils'

function renderPostDetail(post) {
  if (!post) return
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH/mm')
  )

  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=error'
    })
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    // editPageLink.textContent = 'Edit Post'
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  }
}

;(async () => {
  try {
    registerLigthBox({
      modalId: 'ligthBox',
      imgSelector: 'img[data-id="ligthBoxImg"]',
      prevSelector: 'button[data-id="ligthBoxPver"]',
      nextSelector: 'button[data-id="ligthBoxNext"]',
    })
    // get post id from URL
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) return

    // fetch post detail API
    const post = await postApi.getByID(postId)
    // render post detail
    renderPostDetail(post)
  } catch (error) {
    console.log(error)
  }
})()
