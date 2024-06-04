import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../repository/store";
import axios from 'axios';

const BASE_URL = "https://blinddate.darksea.ir/"
export interface AuthState {
    loading: boolean;
    data: any;
    error: any;
}
const initialState: AuthState = {
    loading: false,
    data: undefined,
    error: undefined,
}
export const registerUser = createAsyncThunk(
    "auth/register",
    (values: any) => {

        const res = axios
            .request({
                url: `${BASE_URL}api/authorize/register`,
                method: "POST",
                data: values
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
export const userSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            if (axios.isAxiosError(action.payload)) {
                state.error = action.payload?.response?.data as { status: number, message?: string, title?: string };
                state.data = undefined;
            } else {
                state.data = action.payload;
                state.error = undefined;
            }
        });
        builder.addCase(registerUser.rejected, (state, action) => {
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
    userSlice.actions;
export const userSelector = (state: RootState) => state.userReducer;
export default userSlice.reducer;