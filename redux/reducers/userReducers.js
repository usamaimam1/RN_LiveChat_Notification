const initialState ={
    user:null
}
export const userReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'ADD_USER':
            return Object.assign({},state,{
                user:action.payload
            })
        case 'SET_USER':
            console.log(state)
            return state
        default:
            return state
    }
}
