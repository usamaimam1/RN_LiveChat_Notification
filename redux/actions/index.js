import * as actions from './actionTypes'
import { act } from 'react-test-renderer'
export const AddUser = function (user) {
    return ({
        type: actions.ADD_USER,
        payload: { user: user }
    })
}
export const SetUser = function (user) {
    return {
        type: actions.SET_USER,
        payload: { user: user }
    }
}

export const PrintUser = function () {
    return {
        type: actions.PRINT_USER
    }
}

export const AddProject = function (project) {
    return {
        type: actions.ADD_PROJECT,
        payload: { project: project }
    }
}

export const SetProject = function (projectId, project) {
    return {
        type: actions.SET_PROJECT,
        payload: { projectId: projectId, project: project }
    }
}

export const DeleteProject = function (projectId) {
    return {
        type: actions.DELETE_PROJECT,
        payload: { projectId: projectId }
    }
}

export const AddProjects = function (projects) {
    return {
        type: actions.ADD_PROJECTS,
        payload: { projects: projects }
    }
}
export const PrintProjects = function () {
    return {
        type: actions.PRINT_PROJECTS
    }
}

export const SetActiveProjectId = function (projectId) {
    return {
        type: actions.SET_ACTIVE_PROJECT_ID,
        payload: { projectId: projectId }
    }
}

export const SetRelevantProjectIds = function (_relevantProjectIds) {
    return {
        type: actions.SET_RELEVANT_PROJECTS,
        payload: { relevantProjectIds: _relevantProjectIds }
    }
}

export const AddRelevantProject = function (projectId) {
    return {
        type: actions.ADD_RELEVANT_PROJECT,
        payload: { projectId: projectId }
    }
}

export const AddIssues = function (issues) {
    return {
        type: actions.ADD_ISSUES,
        payload: { issues: issues }
    }
}

export const AddIssue = function (issue) {
    return {
        type: actions.ADD_ISSUE,
        payload: { issue: issue }
    }
}

export const SetIssue = function (issueId, issue) {
    return {
        type: actions.SET_ISSUE,
        payload: { issueId: issueId, issue: issue }
    }
}

export const DeleteIssue = function (issueId) {
    return {
        type: actions.DELETE_ISSUE,
        payload: { issueId: issueId }
    }
}

export const SetIssuesCount = function (issuesCount) {
    return {
        type: actions.SET_ISSUES_COUNT,
        payload: { issuesCount: issuesCount }
    }
}

export const SetActiveIssue = function (activeIssueId) {
    return {
        type: actions.SET_ACTIVE_ISSUE,
        payload: { activeIssueId: activeIssueId }
    }
}

export const SetUsers = function (users) {
    return {
        type: actions.SET_USERS,
        payload: { users: users }
    }
}

export const SetSearchString = function (searchString) {
    return {
        type: actions.SET_SEARCH_STRING,
        payload: { searchString: searchString }
    }
}

export const ResetSearchString = function () {
    return {
        type: actions.RESET_SEARCH_STRING,
        payload: null
    }
}