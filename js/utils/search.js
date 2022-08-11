import debounce from 'lodash.debounce'
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  // set default values from query params ( đặt giá trị mặc định từ các tham số truy vấn)
  // title_like

  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like')
  }
  const debouceSearch = debounce((event) => onChange?.(event.target.value), 500)
  searchInput.addEventListener('input', debouceSearch)
}
