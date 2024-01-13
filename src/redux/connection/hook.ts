import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
    logout,
    setJwtToken,
    setUserInfo
} from "./reducer.ts";

export const useConnection = () => {
    const connection = useSelector((state: any) => state.connection);
    const dispatch = useDispatch();

    const onSetJwtToken = useCallback((jwtToken: string | null) => {
        dispatch(setJwtToken(jwtToken));
    }, [dispatch]);

    const onSetUserInfo = useCallback((userInfo: any | null) => {
        dispatch(setUserInfo(userInfo));
    }, [dispatch]);

    const onLogout = useCallback(() => {
        dispatch(logout())
    }, [dispatch])

    return {
        connection,
        onSetJwtToken,
        onSetUserInfo,
        onLogout,
    }
}
