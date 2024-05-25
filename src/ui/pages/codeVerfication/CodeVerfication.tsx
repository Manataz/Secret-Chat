import { Input, message } from "antd"
import BackButton from "../../components/backButton/BackButton";
import classes from "./style.module.scss";
import { useEffect, useState } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PrimaryButton, SecondaryButton } from "../../components/primaryButton/PrimaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { codeSelector, reset, sendCode } from "../../../features/codeVerify/codeVerifySlice";
import { loginUser } from "../../../features/login/loginSlice";
import { Content } from "antd/es/layout/layout";

const CodeVerfication: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(59);
    const [timeLeftStr, setTimeLeftStr] = useState("00:59");
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();
    const { state } = useLocation();
    const { email } = state;

    const selectedUsers = useAppSelector(codeSelector);
    const dispatch = useAppDispatch();
    useEffect(() => {
        // setUsers(selectedUsers);
        if (selectedUsers.data !== undefined && selectedUsers.data.accessToken) {
            localStorage.setItem("TOKEN", selectedUsers.data.accessToken)
            localStorage.setItem("REFRESH_TOKEN", selectedUsers.data.refreshToken)
            dispatch(reset())
            navigate("/personalInfo");
        } else if(selectedUsers.error) {
            messageApi.open({
                type: 'error',
                content: "مقادیر وارد شده اشتباه است",
            });
        }
        return () => {
            console.log("component unmounting...");
        };
    }, [selectedUsers]);

    const sendVerifyCode = (value: string) => {
        dispatch(sendCode({ email: email, emailCode: value }));
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0)
                setTimeLeft(pr => { return pr - 1 });
        }, 1000);
        return () => {
            clearTimeout(timer)
        };
    });

    useEffect(() => {
        if (timeLeft > 0) {
            if (timeLeft > 9)
                setTimeLeftStr(digitsEnToFa("00:" + timeLeft))
            else
                setTimeLeftStr(digitsEnToFa("00:0" + timeLeft))
        } else {

        }
    }, [timeLeft]);

    return (
        <div className={classes.main}>
            {contextHolder}
            <div className={classes.header}>
                <BackButton backUrl="/" />
            </div>
            <div className={classes.parentContainer}>
                <div>
                    <div className={classes.timer}>{timeLeftStr}</div>
                    <p className={classes.description}>کد تایید ارسال شده به ایمیل خود را وارد نمایید</p>

                    <Input.OTP length={6} onChange={sendVerifyCode} />
                </div>
                <div className={classes.buttonsContainer}>
                    <SecondaryButton isLoading={selectedUsers.loading} label="ارسال مجدد کد تایید" onClick={() => { dispatch(loginUser(email)) }} myClassName={classes.editEmailBtn} />
                    <PrimaryButton isLoading={selectedUsers.loading} label="اصلاح ایمیل" onClick={() => { navigate("./login", { state: { myReset: true } }) }} myClassName={classes.editEmailBtn} />
                </div>

            </div>
        </div>
    )
}

export default CodeVerfication;