import {createStore} from 'redux';

const initialState = {
    onlineOrderData: [], showMenu: false
}

const reducerFunction = (state = initialState, action) => {
    if(action.type === 'add_online_order_data'){
        return {    
            showMenu: state.showMenu,
            onlineOrderData: action.payload,
        }
    }

    else if(action.type === 'toggle'){
        return {
            showMenu: !state.showMenu,
            onlineOrderData: state.onlineOrderData
        }
    }

    return state;
}

const store1 = createStore(reducerFunction);

export default store1

