import { createSlice } from "@reduxjs/toolkit";
import { IConnectionState } from "../../assets/Interface.ts";

const initialState: IConnectionState = {
    jwtToken: localStorage.getItem('jwtToken'),
    userInfo: null,
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setJwtToken(state, action) {
            localStorage.setItem('jwtToken', action.payload);
            state.jwtToken = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        logout(state) {
            localStorage.removeItem('jwtToken');
            state.jwtToken = null;
            state.userInfo = null;
        }
    }
})
const { actions, reducer } = connectionSlice;
export const {
    setJwtToken,
    setUserInfo,
    logout,
} = actions;
export default reducer;
