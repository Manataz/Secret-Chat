import { Button, Form } from "antd";
import BackButton from "../../components/backButton/BackButton";
import classes from "./style.module.scss"
import { PrimaryButton } from "../../components/primaryButton/PrimaryButton";
import MyInput from "../../components/MyInput/MyInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
        console.warn("selectedUsers", selectedUsers)
        if(selectedUsers.data !== undefined && selectedUsers.data.statusCode === 200) {
            dispatch(reset())
            if(buttonClicked) {
                navigate("/codeVerfication", { state: { email: form.getFieldValue("emailAddress") }, replace: true});
                form.resetFields();
            }
        } else if(selectedUsers.error?.statusCode === 400) {
            navigate("/codeVerfication", { state: { email: form.getFieldValue("emailAddress") }, replace: true});
            form.resetFields();
            dispatch(reset());
        } else {
            form.setFields([{name: "emailAddress", errors:[typeof(selectedUsers.error) === typeof("") ? selectedUsers.error : selectedUsers.error?.message]}])
            dispatch(reset());
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
                            {
                                pattern: new RegExp(`[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`),
                                message: "ایمیل وارد شده معتبر نیست"
                            }
                        ]}>
                            <MyInput placeholder="ایمیل خود را وارد نمایید" />
                        </Form.Item>
                    </Form>
                </div>
                <div className={classes.fullWidth}>
                    <PrimaryButton isLoading={selectedUsers.loading} myClassName={classes.submitBtn} label="ارسال کد تایید" onClick={() => {
                        setButtonClicked(true);
                        form.submit();
                    }} />
                    <Link className={classes.linkToStyle} to="/signup"><Button className={classes.fullWidthBtn} size="large">ثبت نام</Button></Link>

                </div>
            </div>
        </div>

    )

}

export default Login;