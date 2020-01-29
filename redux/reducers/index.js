import { combineReducers } from 'redux'
import { userReducer } from './userReducers'
import { projectReducer } from './projectReducers'
import { issuesReducer } from './issuesReducer'
const rootReducer = combineReducers({
    userReducer,
    projectReducer,
    issuesReducer
})
export default rootReducer