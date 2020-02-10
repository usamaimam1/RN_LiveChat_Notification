import { combineReducers } from 'redux'
import { userReducer } from './userReducers'
import { projectReducer } from './projectReducers'
import { issuesReducer } from './issuesReducer'
import { searchReducer } from './searchReducers'
const rootReducer = combineReducers({
    userReducer,
    projectReducer,
    issuesReducer,
    searchReducer
})
export default rootReducer