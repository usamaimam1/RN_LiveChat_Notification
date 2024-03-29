const initialState = {
    projectDetails: [],
    activeProjectId: null,
    activeProjectData: [],
    relevantProjectIds: []
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
            let newProject = []
            newProject.push(action.payload.project)
            _projectDetails.forEach((_proj, index) => {
                if (_proj.projectId === action.payload.projectId) {
                    _projectDetails[index] = action.payload.project
                    return Object.assign({}, state, {
                        projectDetails: _projectDetails,
                        activeProjectData: state.activeProjectId === action.payload.projectId ? newProject : state.activeProjectData
                    })
                }
            })
            return state
        case 'DELETE_PROJECT':
            const __projectDetails = state.projectDetails
            let filtered_projects = __projectDetails.filter(proj => proj.projectId !== action.payload.projectId)
            let activeProjectId = state.activeProjectId === action.payload.projectId ? null : state.activeProjectId
            let activeProjectData = state.activeProjectId === action.payload.projectId ? [] : state.activeProjectData
            return Object.assign({}, state, {
                projectDetails: filtered_projects,
                activeProjectId: activeProjectId,
                activeProjectData: activeProjectData,
                relevantProjectIds: state.relevantProjectIds.filter(_id => _id !== action.payload.projectId)
            })
        case 'SET_RELEVANT_PROJECTS':
            return Object.assign({}, state, {
                relevantProjectIds: action.payload.relevantProjectIds
            })
        case 'ADD_RELEVANT_PROJECT':
            let _relevantProjects = state.relevantProjectIds
            _relevantProjects.push(action.payload.projectId)
            return Object.assign({}, state, {
                relevantProjectIds: _relevantProjects
            })
        case 'PRINT_PROJECTS':
            return state
        case 'RESET_PROJECTS':
            return Object.assign({}, state, {
                projectDetails: [],
                activeProjectId: null,
                activeProjectData: [],
                relevantProjectIds: []
            })
        default:
            return state
    }
}