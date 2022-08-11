import { setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="author"]', formValues?.author)
  setFieldValue(form, '[name="description"]', formValues?.description)
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl)

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValue(form) {
  const formValues = {}
  //* s1 : query each input and add to values object
  //   ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name=${name}]`)
  //     if (field) value[name] = field.value
  //     console.log(name)
  //   })

  // s2 : using form data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  })
}

function setFieldError(form, name, errors) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) element.setCustomValidity(errors)
  setTextContent(element.parentElement, '.invalid-feedback', errors)
}

async function validatePostForm(form, formValue) {
  try {
    // reset previous errors
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    // start validating
    const schema = getPostSchema()
    await schema.validate(formValue, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        // ignore if the field is already logged
        if (errorLog[name]) continue

        // set field error and mark logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  // add was-validated class to form
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return
  setFormValues(form, defaultValue)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // get form value
    const formValue = getFormValue(form)

    // validation
    // if valid trigger submit callback
    // otherwise , show validation errors
    const isValid = await validatePostForm(form, formValue)
    if (!isValid) return

    onSubmit?.(formValue)
  })
}
