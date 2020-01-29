const initialState ={
    user:null,
}
export const userReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'ADD_USER':
            console.log(action)
            return Object.assign({},state,{
                user:action.payload.user
            })
        case 'PRINT_USER':
            console.log(state)
            return state
        default:
            return state
    }
}
