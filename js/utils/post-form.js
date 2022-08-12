import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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
    imageSource: yup.string
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image Source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image ')
        .url('Please enter valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup.mixed().required('Please select an image to upload '),
    }),
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
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

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

function showLoanding(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hidenLoanding() {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    // set imageURl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0])
    // get selected file
    // preview file
    const file = event.target.files[0]
    if (file) {
      const imageUrL = URL.createObjectURL(file)
      setBackgroundImage(document, '#postHeroImage', imageUrL)
    }
  })
}

export function initPostForm({ formId, defaultValue, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false
  setFormValues(form, defaultValue)

  // init events
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (submitting) return

    showLoanding(form)
    submitting = true

    // get form value
    const formValue = getFormValue(form)

    // validation
    // if valid trigger submit callback
    // otherwise , show validation errors
    const isValid = await validatePostForm(form, formValue)
    if (!isValid) return
    console.log(form, formValue)

    await onSubmit?.(formValue)

    hidenLoanding(form)
    submitting = false
  })
}
