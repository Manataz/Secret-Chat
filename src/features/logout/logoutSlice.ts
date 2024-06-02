import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../repository/store";
import axios from 'axios';

const BASE_URL = "https://blinddate.darksea.ir/"
export interface AuthState {
    loading: boolean;
    data: any;
    error: any | undefined;
}
const initialState: AuthState = {
    loading: false,
    data: undefined,
    error: undefined,
}
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/authorize/logout`,
                method: "GET",
                headers: {
                    "Content-Type": "text/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                return data;
            })
            .catch(error => {
                return error;

                // if (error.response && error.response.status === 403) {
                //     console.warn(error.response)
                // }
            })
            .finally(() => { });

        // const res = axios.post().then(data => data);
        return res;
    }
);

export const logoutSlice = createSlice({
    name: "login",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
            state.error = undefined;
        });
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
    },
    reducers: {
        reset: (state) => {
            state = initialState;
        },
    },
});

export const { reset } =
    logoutSlice.actions;
export const logoutSelector = (state: RootState) => state.logoutReducer;
export default logoutSlice.reducer;