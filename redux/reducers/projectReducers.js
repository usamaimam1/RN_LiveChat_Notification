const initialState = {
    projectDetails: []
}
export const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PROJECTS':
            console.log(action)
            return Object.assign({}, state, {
                projectDetails: action.payload.projects
            })
        case 'ADD_PROJECT':
            return Object.assign({}, state, {
                projectDetails: [...state.projectDetails, action.payload.project]
            })
        case 'SET_PROJECT':
            const _projectDetails = state.projectDetails
            _projectDetails[action.payload.projectId] = action.payload.project
            return Object.assign({}, state, {
                projectDetails: _projectDetails
            })
        case 'DELETE_PROJECT':
            const __projectDetails = state.projectDetails
            let filtered_projects = __projectDetails.filter(proj => proj.projectId !== action.payload.projectId)
            return Object.assign({}, state, {
                projectDetails: filtered_projects
            })
        case 'PRINT_PROJECTS':
            console.log(state)
            return state
        default:
            return state
    }
}