import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/signup/signupSlice";
import loginReducer from "../features/login/loginSlice";
import codeReducer from "../features/codeVerify/codeVerifySlice";
import personalInfoReducer from "../features/personalInfo.ts/personalInfoSlice";
import logoutReducer from "../features/logout/logoutSlice";
export const store = configureStore({
    reducer: {
        userReducer,
        loginReducer,
        codeReducer,
        personalInfoReducer,
        logoutReducer
    },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;