const initialState = {
    searchString: null,
    users: [],
    searchResults: []
}

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return Object.assign({}, state, {
                users: action.payload.users
            })
        case 'SET_SEARCH_STRING':
            return Object.assign({}, state, {
                searchString: action.payload.searchString,
                searchResults: state.users.filter(_user => _user.fullName.includes(action.payload.searchString))
            })
        case 'RESET_SEARCH_STRING':
            return Object.assign({}, state, {
                searchString: null,
                searchResults: []
            })
        default:
            return state
    }
}