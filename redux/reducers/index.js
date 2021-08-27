import { combineReducers } from 'redux'
import { userReducer } from './userReducers'
import { projectReducer } from './projectReducers'
import { issuesReducer } from './issuesReducer'
import { searchReducer } from './searchReducers'
import { networkReducer } from './networkReducer'
const rootReducer = combineReducers({
    userReducer,
    projectReducer,
    issuesReducer,
    searchReducer,
    networkReducer
})
export default rootReducer