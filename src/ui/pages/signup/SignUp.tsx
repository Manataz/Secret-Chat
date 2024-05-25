import { Form } from "antd";
import BackButton from "../../components/backButton/BackButton";
import classes from "./style.module.scss"
import MyInput from "../../components/MyInput/MyInput";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../../components/primaryButton/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { registerUser, reset, userSelector } from "../../../features/signup/signupSlice";
import MessageBox from "../../components/messageBox/MessageBox";

const SignUp: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [showDescription, setShowDescription] = useState<boolean>(true);
    const nameInput = Form.useWatch("name", form);

    const selectedUsers = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(selectedUsers.data !== undefined && selectedUsers.data.statusCode === 200) {
            dispatch(reset())
            navigate("/codeVerfication", { state: { email: form.getFieldValue("emailAddress") }, replace: true});
        }
        return () => {
          console.log("component unmounting...");
        };
      }, [selectedUsers]);

      function handleRegister(values: any) {
        dispatch(registerUser({...values}));
      }

    useEffect(() => {
        if (nameInput) {
            setShowDescription(false);
        }
    }, [nameInput])
    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <BackButton backUrl="/" />
            </div>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>
                    <h2>ثبت نام</h2>
                    <Form form={form} layout="vertical" className={classes.formStyles} onFinish={handleRegister}>
                        <Form.Item name={"name"} rules={[
                            {
                                required: true,
                                message: "لطفا نام خود را وارد کنید"
                            },
                            {
                                max: 10,
                                message: "تعداد کاراکتر بیشتر از حد مجاز می‌باشد",
                            },
                        ]}>
                            <MyInput placeholder="نام خود را وارد نمایید. (حداکثر 10 کاراکتر)" />
                        </Form.Item>
                        {showDescription && (
                            <div className={classes.nameDescription}>در انتخاب نام خود دقت کنید، این نام قابل تغییر نمی‌باشد</div>
                        )}
                        <Form.Item name={"emailAddress"} rules={[
                            {
                                required: true,
                                message: "ایمیل خود را وارد کنید"
                            },
                        ]}>
                            <MyInput placeholder="ایمیل خود را وارد نمایید" />
                        </Form.Item>
                    </Form>
                    {selectedUsers.data === undefined && (
                        <MessageBox type="error" content="خطایی رخ داد!" />
                    )}
                </div>
                <PrimaryButton isLoading={selectedUsers.loading} myClassName={classes.submitBtn} label="ارسال کد تایید" onClick={() => {
                    form.submit()
                }} />
            </div>
        </div>

    )

}

export default SignUp; 