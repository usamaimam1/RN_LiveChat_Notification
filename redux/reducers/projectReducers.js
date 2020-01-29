import { ActionSheet } from "native-base"

const initialState = {
    projectDetails: [],
    activeProjectId: null,
    activeProjectData: null
}
export const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_PROJECT_ID':
            return Object.assign({}, state, {
                activeProjectId: action.payload.projectId,
                activeProjectData: state.projectDetails.filter(_proj => _proj.projectId === action.payload.projectId)
            })
        case 'ADD_PROJECTS':
            return Object.assign({}, state, {
                projectDetails: action.payload.projects
            })
        case 'ADD_PROJECT':
            return Object.assign({}, state, {
                projectDetails: [...state.projectDetails, action.payload.project]
            })
        case 'SET_PROJECT':
            const _projectDetails = state.projectDetails
            _projectDetails.forEach((_proj, index) => {
                if (_proj.projectId === action.payload.projectId) {
                    _projectDetails[index] = action.payload.project
                    return Object.assign({}, state, {
                        projectDetails: _projectDetails,
                        activeProjectData: state.activeProjectId === action.payload.projectId ? action.payload.project : state.activeProjectData
                    })
                }
            })
            return state
        case 'DELETE_PROJECT':
            const __projectDetails = state.projectDetails
            let filtered_projects = __projectDetails.filter(proj => proj.projectId !== action.payload.projectId)
            return Object.assign({}, state, {
                projectDetails: filtered_projects,
                activeProjectId: state.activeProjectId === action.payload.projectId ? null : state.activeProjectId,
                activeProjectData: state.activeProjectId === action.payload.projectId ? null : state.activeProjectData
            })
        case 'PRINT_PROJECTS':
            return state
        default:
            return state
    }
}