const initialState = {
    netState: null
}
export const networkReducer = (state = initialState, action){
    switch (action.type) {
        case 'SET_NETWORK_STATE':
            return Object.assign({}, state, {
                netState: payload.netstate
            })
        default:
            return state
    }
}