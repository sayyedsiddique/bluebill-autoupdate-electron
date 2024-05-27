import {createSlice} from '@reduxjs/toolkit';

const initialState = {showMenu: false, onlineOrderData: []}

const toggleMenuSlice = createSlice({
    name: 'menuToggle',
    initialState: initialState,
    reducers: {
         toggleMenu(state,action){
            
            if(action.type === 'add_online_order_data'){
                return {    
                    showMenu: state.showMenu,
                    onlineOrderData: action.payload,
                }
            }
        
            if(action.type === 'toggle'){
                return {
                    showMenu: !state.showMenu,
                    onlineOrderData: state.onlineOrderData
                }
            }

            return state;
        
        }
}});

export const {toggleMenu} = toggleMenuSlice.actions
export default toggleMenuSlice.reducer;