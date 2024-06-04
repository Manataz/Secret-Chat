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
export const loginUser = createAsyncThunk(
    "auth/sendVerifyEmail",
    (values: any) => {

        const res = axios
            .request({
                url: `${BASE_URL}api/authorize/sendVerifyEmail`,
                method: "POST",
                headers: { "Content-Type": "text/json" },
                data: `"${values}"`
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
)

export const loginSlice = createSlice({
    name: "login",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            if (axios.isAxiosError(action.payload)) {
                state.error = action.payload?.response?.data as { statusCode: number, message: string };
                state.data = undefined;
            } else {
                state.data = action.payload;
                state.error = undefined;
            }
        });
        builder.addCase(loginUser.rejected, (state, action) => {
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
    loginSlice.actions;
export const loginSelector = (state: RootState) => state.loginReducer;
export default loginSlice.reducer;