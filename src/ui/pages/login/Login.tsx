import { Form } from "antd";
import BackButton from "../../components/backButton/BackButton";
import classes from "./style.module.scss"
import { PrimaryButton } from "../../components/primaryButton/PrimaryButton";
import MyInput from "../../components/MyInput/MyInput";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { loginSelector, loginUser, reset } from "../../../features/login/loginSlice";
import { useEffect, useState } from "react";
const Login: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const selectedUsers = useAppSelector(loginSelector);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if(selectedUsers.data !== undefined && selectedUsers.data.statusCode === 200) {
            dispatch(reset())
            if(buttonClicked) {
                navigate("/codeVerfication", { state: { email: form.getFieldValue("emailAddress") }, replace: true});
            }
        }
        return () => {
          console.log("component unmounting...");
        };
      }, [selectedUsers]);

    function handleRegister(values: any) {
        dispatch(loginUser(values?.emailAddress));
    }

    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <BackButton backUrl="/" />
            </div>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>
                    <Form form={form} layout="vertical" className={classes.formStyles} onFinish={handleRegister}>
                        <Form.Item name={"emailAddress"} rules={[
                            {
                                required: true,
                                message: "ایمیل خود را وارد کنید"
                            },
                        ]}>
                            <MyInput placeholder="ایمیل خود را وارد نمایید" />
                        </Form.Item>
                    </Form>
                </div>
                <PrimaryButton isLoading={selectedUsers.loading} myClassName={classes.submitBtn} label="ارسال کد تایید" onClick={() => {
                    setButtonClicked(true);
                    form.submit()
                }} />
            </div>
        </div>

    )

}

export default Login;