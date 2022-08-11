function showModal(modalElement) {
  const myModal = new window.bootstrap.Modal(modalElement)
  if (myModal) myModal.show()
}
export function registerLigthBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // Selectors
  const imgElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imgElement || !prevButton || !nextButton) return

  // ligthbox vars
  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src
  }

  // handle click for all images ---> event Delegation
  // images click --> find all images with the same album / galley
  // determine index of selected images
  // show modal with selected img
  // handle prev / next click\

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    // img with data album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    // console.log('album img click', target, imgList, currentIndex)

    // show image at index
    showImageAtIndex(currentIndex)
    // show modal
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })

  nextButton.addEventListener('click', () => {
    // show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })
}
