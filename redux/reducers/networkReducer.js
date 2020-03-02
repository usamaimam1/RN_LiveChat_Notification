const initialState = {
    netState: {
        isConnected: false,
        isInternetReachable: false
    }
}
export const networkReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_NETWORK_STATE':
            return Object.assign({}, state, {
                netState: action.payload.netstate
            })
        default:
            return state
    }
}