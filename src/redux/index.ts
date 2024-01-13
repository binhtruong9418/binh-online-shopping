import connection from './connection';
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
    connection: connection,
};

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }),
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
