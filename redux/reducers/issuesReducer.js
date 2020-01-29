const initialState = {
    issueDetails: [],
}
export const issuesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ISSUES':
            return Object.assign({}, state, {
                issueDetails: action.payload.issues
            })
        case 'ADD_ISSUE':
            let _prevIssues = state.issueDetails
            _prevIssues.push(action.payload.issue)
            return Object.assign({}, state, {
                issueDetails: _prevIssues
            })
        case 'SET_ISSUE':
            let _issues = state.issueDetails
            _issues.forEach((_issue, index) => {
                if (_issue.issueId === action.payload.issueId) {
                    _issues[index] = action.payload.issue
                    return Object.assign({}, state, {
                        issueDetails: issues
                    })
                }
            })
            return state
        case 'DELETE_ISSUE':
            return Object.assign({}, state, {
                issueDetails: state.issueDetails.filter(_issue => _issue.issueId !== action.payload.issueId)
            })
        default:
            return state
    }
}