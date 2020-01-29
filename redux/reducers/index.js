import {combineReducers} from 'redux'
import {userReducer} from './userReducers'
import {projectReducer} from './projectReducers'
const rootReducer = combineReducers({
    userReducer,
    projectReducer
})
export default rootReducer