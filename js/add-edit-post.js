import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  // console.log('submit form parent', formValues)
  try {
    // check add / edit mode
    // check id in formValues
    // call API
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show success message
    toast.success('Save post successfully !')
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 2000)
  } catch (error) {
    console.log(error)
    toast.error(`Error : ${error.message}`)
  }
}
// main
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = postId
      ? await postApi.getByID(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValue,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log(error)
  }
})()
