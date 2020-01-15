import * as actions from './actionTypes'
export const AddUser = function(user){
    return({
        type:actions.ADD_USER,
        payload:user
    })
}
export const SetUser = function(user){
    return{
        type:actions.SET_USER,
        payload:user
    }
}