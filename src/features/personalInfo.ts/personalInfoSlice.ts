import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../../repository/store";
import axios from 'axios';

const BASE_URL = "https://blinddate.darksea.ir/"
export interface AuthState {
    loading: boolean;
    data: any;
    error: SerializedError | string | undefined;
}
const initialState: AuthState = {
    loading: false,
    data: undefined,
    error: undefined,
}
export const getProviences = createAsyncThunk(
    "userProfile/proviences",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/getAllProvinces`,
                method: "POST",
                headers: { "accept": "application/json", "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "province" };
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
export const getAvatars = createAsyncThunk(
    "userProfile/avatars",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/getAllAvatars`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "avatar" };
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
export const getPersonalInfo = createAsyncThunk(
    "userProfile/getPersonalInfo",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/getUserProfile`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "profile" };
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
export const getSuccessMeets = createAsyncThunk(
    "userProfile/getSuccessMeets",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/GetSuccessMeetFriends`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "ok" };
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
export const sendReport = createAsyncThunk(
    "userProfile/sendReport",
    (values: any) => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/sendReport`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                data: values,
            })
            .then(({ data }) => {
                return { ...data };
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
export const getFailMeets = createAsyncThunk(
    "userProfile/getFailMeets",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/GetFailMeetFriends`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "fail" };
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
export const getReportMessages = createAsyncThunk(
    "userProfile/getReportMessages",
    () => {
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .request({
                url: `${BASE_URL}api/userProfile/getReportMessages`,
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(({ data }) => {
                return { ...data, type: "reportM" };
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
export const completeProfile = createAsyncThunk(
    "userProfile/completeProfile",
    (values: any) => {
        let data = new FormData();
        data.append('Profile', values.Profile.file, values.Profile.file.name);
        data.append('Gender', values.Gender);
        data.append('ProvinceId', values.ProvinceId);
        data.append('InstagramId', values.InstagramId);
        data.append('AvatarId', values.AvatarId);
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .post(
                `${BASE_URL}api/userProfile/completeProfile`,
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': `multipart/form-data;`
                    }
                },
            )
            .then(({ data }) => {
                return { ...data, type: "info" };
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
export const editProfile = createAsyncThunk(
    "userProfile/editProfile",
    (values: any) => {
        let data = new FormData();
        data.append('Profile', values.Profile.file, values.Profile.file.name);
        data.append('ProvinceId', values.ProvinceId);
        data.append('InstagramId', values.InstagramId);
        data.append('AvatarId', values.AvatarId);
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .post(
                `${BASE_URL}api/userProfile/editProfile`,
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': `multipart/form-data;`
                    }
                },
            )
            .then(({ data }) => {
                return { ...data, type: "edit" };
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
function DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
}
export const paintPartnerAvatar = createAsyncThunk(
    "userProfile/paintPartnerAvatar",
    (values: any) => {
        const mfile = DataURIToBlob(values.file)
        let data = new FormData();
        data.append('file', mfile, 'image.png');
        const token = localStorage.getItem("TOKEN");
        const res = axios
            .post(
                `${BASE_URL}api/userProfile/paintPartnerAvatar`,
                data,
                {
                    params: {
                        meetname: values.meetName,
                    },
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': `multipart/form-data;`
                    }
                },
            )
            .then(({ data }) => {
                return { ...data, type: "edit" };
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
export const personalInfoSlice = createSlice({
    name: "code",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getProviences.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProviences.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getProviences.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(getAvatars.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAvatars.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getAvatars.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(getFailMeets.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getFailMeets.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getFailMeets.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(getSuccessMeets.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getSuccessMeets.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getSuccessMeets.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(sendReport.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sendReport.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(sendReport.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(getReportMessages.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getReportMessages.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getReportMessages.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(getPersonalInfo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPersonalInfo.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getPersonalInfo.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(completeProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(completeProfile.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(completeProfile.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(editProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editProfile.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(editProfile.rejected, (state, action) => {
            state.loading = false;
            state.data = undefined;
            state.error = action.error;
        });
        builder.addCase(paintPartnerAvatar.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(paintPartnerAvatar.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(paintPartnerAvatar.rejected, (state, action) => {
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
    personalInfoSlice.actions;
export const personalInfoSelector = (state: RootState) => state.personalInfoReducer;
export default personalInfoSlice.reducer;