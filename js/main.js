import postApi from './api/postApi'
import { initPagination, initSearch, renderPostList, renderPagination, toast } from './utils'

async function handleFiterChange(fiterName, filterValue) {
  try {
    const url = new URL(window.location)

    if (fiterName) url.searchParams.set(fiterName, filterValue)

    if (fiterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    // fetch API (gọi lại API)
    // re-render postList
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log(error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      await postApi.remove(post.id)

      await handleFiterChange()
    } catch (error) {
      toast.error(error.message)
    }
  })
}

//main
;(async () => {
  try {
    const url = new URL(window.location)
    console.log(url)
    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)

    const queryParams = url.searchParams
    // console.log(queryParams)

    registerPostDeleteEvent()

    // attach click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFiterChange('_page', page),
    })

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFiterChange('title_like', value),
    })
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log(error)
  }
})()
