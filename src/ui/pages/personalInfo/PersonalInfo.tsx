import { Avatar, Badge, Form, Modal, Upload } from "antd";
import classes from "./style.module.scss";
import { PrimaryButton, SecondaryButton } from "../../components/primaryButton/PrimaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import MyInput from "../../components/MyInput/MyInput";
import { useEffect, useState } from "react";
import MySelect from "../../components/mySelect/MySelect";
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { personalInfoSelector, getAvatars, getProviences, reset, completeProfile, editProfile, getPersonalInfo, acceptTerms } from "../../../features/personalInfo.ts/personalInfoSlice";
import { UserOutlined } from "@ant-design/icons";
import camera from "../../../icons/camera.svg";
import BackButton from "../../components/backButton/BackButton";

const PersonalInfo = () => {

    const selectedUsers = useAppSelector(personalInfoSelector);
    const dispatch = useAppDispatch();
    const [provinces, setProvinces] = useState([]);
    const [avatars, setAvatars] = useState([]);
    const [myAvatar, setMyAvatar] = useState({ id: 0, src: "" });
    const [fileListState, setFileListState] = useState<any>([]);
    const [imageUrl, setImageUrl] = useState<any>("");

    useEffect(() => {
        // setUsers(selectedUsers);
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "province") {
            setProvinces(selectedUsers.data.result.map((s: { provinceId: number, provinceName: string }) => {
                return { value: s.provinceId, label: s.provinceName }
            }))
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "avatar") {
            setAvatars(selectedUsers.data.result)
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "info" && selectedUsers.data.statusCode === 200) {
            navigate("./home")
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "edit" && selectedUsers.data.statusCode === 200) {
            navigate("./home")
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "profile" && selectedUsers.data.result !== undefined) {
            navigate("./home")
        }
        return () => {
            console.log("component unmounting...");
        };
    }, [selectedUsers]);

    useEffect(() => {
        dispatch(getProviences())
        dispatch(getAvatars())
        dispatch(getPersonalInfo())
    }, [])

    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [gender, setGender] = useState(false);
    const { state } = useLocation();

    function getBase64(file: any) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const handleChangeImage = (info: any) => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);
        setFileListState(fileList);

        getBase64(info.file).then(base64 => {
            setImageUrl(base64) // Here's your base64 string
        });

    };

    const handleSave = (values: any) => {
        if (state?.from && state?.from === "HOME") {
            dispatch(editProfile({ ...values, AvatarId: myAvatar.id }))
        } else {
            dispatch(completeProfile({ ...values, Gender: gender, AvatarId: myAvatar.id }));
            dispatch(acceptTerms());
        }
    }
    return (
        <div className={classes.main}>
            {state?.from && state?.from === "HOME" && (
                <div className={classes.header}>
                    <BackButton backUrl="/home" />
                </div>

            )}
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>
                    <h2>اطلاعات فردی</h2>
                    <Form form={form} layout="vertical" className={classes.formStyles} onFinish={handleSave}>
                        {state?.from && state?.from === "HOME" ? (
                            <></>
                        ) : (
                            <>
                                {!gender && (
                                    <PrimaryButton myClassName={classes.submitBtn} label="زن" onClick={() => {
                                        setGender(false);
                                    }} />
                                )}
                                {gender && (
                                    <SecondaryButton myClassName={classes.submitBtn} label="زن" onClick={() => {
                                        setGender(false);
                                        setMyAvatar({ id: 0, src: "" })
                                    }} />
                                )}
                                {gender && (
                                    <PrimaryButton myClassName={classes.submitBtn} label="مرد" onClick={() => {
                                        setGender(true);
                                    }} />
                                )}
                                {!gender && (
                                    <SecondaryButton myClassName={classes.submitBtn} label="مرد" onClick={() => {
                                        setGender(true);
                                        setMyAvatar({ id: 0, src: "" })
                                    }} />
                                )}
                            </>
                        )}
                        <Form.Item name={"ProvinceId"} rules={[
                            {
                                required: true,
                                message: "شهر خود را وارد انتخاب کنید"
                            },
                        ]}>
                            <MySelect
                                placeholder="شهر خود را انتخاب کنید"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.props?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={handleChange}
                                options={provinces}
                            />
                        </Form.Item>
                        <div>
                            <Avatar size={124} icon={<UserOutlined />} src={myAvatar.src} />
                        </div>
                        <div>
                            {avatars.map((ava: { avatarURL: string, avatarId: number, gender: boolean }) => {
                                if (ava.gender === gender) {
                                    return <Avatar size={55} src={ava.avatarURL} key={ava.avatarId} onClick={() => {
                                        setMyAvatar({ id: ava.avatarId, src: ava.avatarURL })
                                    }} />
                                }
                            })}
                        </div>
                        <Form.Item
                            name='Profile'
                            rules={[
                                {
                                    required: true,
                                    message: 'input Image',
                                },
                            ]}
                        >
                            <Upload
                                beforeUpload={(file) => {
                                    return false;
                                }}
                                onChange={handleChangeImage}
                                multiple={false}
                                listType='picture'
                                defaultFileList={fileListState.fileList}
                                showUploadList={false}
                                style={{ width: "100%" }}
                            >
                                <div style={{ "marginBottom": "30px", "fontFamily": "Mikhak" }}>
                                    <h2 style={{ textAlign: "right" }}>انتخاب عکس</h2>
                                    <p style={{ textAlign: "right" }}>لطفا عکسی از خود انتخاب کنید <br /> چرا که این عکس نمایانگر شماست</p>
                                    <Badge count={<Avatar size={62} src={camera} />} offset={[-10, 120]} >

                                        <Avatar key={imageUrl} size={124} shape="square" icon={<UserOutlined />}
                                            src={imageUrl !== "" ? <img src={imageUrl} /> : <Avatar shape="square" icon={<UserOutlined />} size={124} />}
                                            alt="new" />
                                    </Badge>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item name={"InstagramId"} rules={[
                            {
                                required: true,
                                message: "آیدی اینستاگرام خود را وارد نمایید"
                            },
                        ]}>
                            <MyInput placeholder="آیدی اینستاگرام خود را وارد نمایید" />
                        </Form.Item>
                    </Form>
                    <PrimaryButton myClassName={classes.submitBtn} label="ثبت" onClick={() => {
                        form.submit()
                    }} />
                </div>
            </div>
        </div>

    )
}

export default PersonalInfo;