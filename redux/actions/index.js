import * as actions from './actionTypes'
import { act } from 'react-test-renderer'
export const AddUser = function(user){
    return({
        type:actions.ADD_USER,
        payload:{user:user}
    })
}
export const SetUser = function(user){
    return{
        type:actions.SET_USER,
        payload:{user:user}
    }
}

export const PrintUser = function(){
    return{
        type: actions.PRINT_USER
    }
}

export const AddProject = function(project){
    return{
        type:actions.ADD_PROJECT,
        payload:{project:project}
    }
}

export const SetProject = function(projectId,project){
    return{
        type:actions.SET_PROJECT,
        payload:{projectId:projectId,project:project}
    }
}

export const DeleteProject = function(projectId){
    return{
        type:actions.DELETE_PROJECT,
        payload:{projectId:projectId}
    }
}

export const AddProjects = function(projects){
    return{
        type:actions.ADD_PROJECTS,
        payload:{projects:projects}
    }
}
export const PrintProjects = function(){
    return{
        type:actions.PRINT_PROJECTS
    }
}