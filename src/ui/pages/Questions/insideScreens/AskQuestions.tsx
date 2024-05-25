import { Form, Progress } from "antd";
import classes from "./style.module.scss";
import { useEffect, useState } from "react";
import MyInput from "../../../components/MyInput/MyInput";
import { PrimaryButton } from "../../../components/primaryButton/PrimaryButton";
import moment from "moment";
import { digitsEnToFa } from "@persian-tools/persian-tools";

interface IProps {
    meetName: string;
    calls: (methodName: string, args: any[]) => void
}

const AskQuestions: React.FC<IProps> = (props) => {
    const [form] = Form.useForm();
    const [nextButtonLabel, setNextButtonLabel] = useState<string>("ارسال سوالات");
    const [timeLeftStr, setTimeLeftStr] = useState("");
    const [minutes, setMinutes] = useState(3)
    const [seconds, setSeconds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0)
                setTimeLeft(pr => {
                    const newPr = pr - 1;
                    setMinutes(Math.floor(newPr / 60))
                    setSeconds(Math.floor(newPr % 60))
                    return newPr;
                });
        }, 1000);
        return () => {
            clearTimeout(timer)
        };
    });

    useEffect(() => {
        setTimeLeftStr(digitsEnToFa(`${minutes}:${seconds}`))
    }, [timeLeft]);

    const handleFinish = (values: any) => {
        props.calls("CreateUserQuestion", [props.meetName, values.q1, values.q2, values.q3]);
    }
    return (
        <div className={classes.regualrParentContainer}>
            <div className={classes.regualrMainContainer}>
                <div className={`${classes.progressContainer} ${classes.standalone}`}>
                    <div className={classes.timerContainer}>
                        <div className={classes.timer}>{timeLeftStr}</div>
                        <Progress
                            percent={(timeLeft * 100) / 180}
                            size={[150, 10]}
                            key={timeLeft}
                            trailColor="#ffffff"
                            showInfo={false}
                            strokeColor={{ from: "#EA3E5C", to: "#931372" }}
                            strokeLinecap="round" />
                    </div>
                </div>
                <Form form={form} layout="vertical" style={{ width: "100%" }} onFinish={handleFinish}>
                    <Form.Item
                        label={"سوال اول"}
                        name={"q1"}
                        rules={[
                            {
                                required: true,
                                message: 'الزامی است',
                            },
                        ]}>
                        <MyInput placeholder="سوال خود را وارد کنید( حداکثر 20 کارکتر)" />
                    </Form.Item>
                    <Form.Item
                        label={"سوال دوم"}
                        name={"q2"}
                        rules={[
                            {
                                required: true,
                                message: 'الزامی است',
                            },
                        ]}>
                        <MyInput placeholder="سوال خود را وارد کنید( حداکثر 20 کارکتر)" />
                    </Form.Item>
                    <Form.Item
                        label={"سوال سوم"}
                        name={"q3"}
                        rules={[
                            {
                                required: true,
                                message: 'الزامی است',
                            },
                        ]}>
                        <MyInput placeholder="سوال خود را وارد کنید( حداکثر 20 کارکتر)" />
                    </Form.Item>
                </Form>
            </div>
            <PrimaryButton label={nextButtonLabel} onClick={() => {
                form.submit();
            }} myClassName={classes.nextQButton} />
        </div>
    )
}

export default AskQuestions;