let initialState = {
  isLoading: false,
  isSuccessful: false,
  isFailed: false,
}

let reducer = (state, action) => {
  switch (action.type) {
    case 'loading': {
      return { ...state, isLoading: true }
    }
    case 'successful': {
      return { ...state, isSuccessful: true, isLoading: false }
    }
    case 'failed': {
      return { ...state, isFailed: true }
    }
    default:
      return {
        ...state,
      }
  }
}

export default { reducer, initialState }
