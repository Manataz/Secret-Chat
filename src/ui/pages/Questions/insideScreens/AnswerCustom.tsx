import { Form, Progress } from "antd";
import classes from "./style.module.scss";
import MyInput from "../../../components/MyInput/MyInput";
import { PrimaryButton } from "../../../components/primaryButton/PrimaryButton";
import { useEffect, useState } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import EmojiPicker from "../../../components/EmojiPicker/EmojiPicker";
import { Question, UserResponse } from "../models/models";
import { EmojiResponse } from "../JoinMeet";

interface IProps {
    question: Question[];
    meetName: string;
    isPersonal: boolean;
    answer?: UserResponse[];
    emojis?: EmojiResponse[];
    calls: (methodName: string, args: any[]) => void
}

const AnswerCustom: React.FC<IProps> = (props) => {
    const [form] = Form.useForm();
    const [nextButtonLabel, setNextButtonLabel] = useState<string>("...در انتظار");
    const [timeLeftStr, setTimeLeftStr] = useState("");
    const [myEmojis, setMyEmojis] = useState<EmojiResponse[]>([]);
    const [minutes, setMinutes] = useState(3)
    const [seconds, setSeconds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(180);

    useEffect(() => {
        if (props.answer && props.answer !== undefined && props.answer.length >= 3) {
            setNextButtonLabel("سوال بعدی");
        } else {
            setNextButtonLabel("...در انتظار");
        }
    }, [props.answer])

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
        if (timeLeft === 0) {
            props.calls("Next2OptionQuestion", [`${props.meetName}`])
        }
    }, [timeLeft]);
    return (
        <div className={`${classes.regualrParentContainer} ${classes.scrollable}`}>
            <div className={classes.regualrMainContainer}>
                <div className={`${classes.progressContainer} ${classes.standalone}`}>
                    <div className={classes.timerContainer}>
                        <div className={classes.timer}>{timeLeftStr}</div>
                        <Progress
                            percent={timeLeft * 100 / 180}
                            size={[150, 10]}
                            key={timeLeft}
                            trailColor="#ffffff"
                            showInfo={false}
                            strokeColor={{ from: "#EA3E5C", to: "#931372" }}
                            strokeLinecap="round" />
                    </div>
                </div>
                <h3>سوالات شما</h3>
                <Form form={form} layout="vertical" style={{ width: "100%" }}>
                    {props.question?.map((q: Question, index: number) => {
                        return (
                            <div key={`q${index}`}>
                                <Form.Item
                                    label={q.title}
                                    name={"answer" + index}>
                                    <MyInput placeholder="پاسخ خود را وارد کنید( حداکثر 20 کارکتر)" />
                                </Form.Item>
                                <div className={classes.emojiContainer} style={{ position: "relative", top: "-20px" }}>
                                    <div className={`${classes.progressContainer} ${classes.noProgress}`}>
                                        <PrimaryButton
                                            label="ارسال پاسخ"
                                            onClick={() => {
                                                const answer = form.getFieldValue("answer" + index);
                                                if (answer !== "") {
                                                    if (props.isPersonal) {
                                                        props.calls("SavePersonalQAnswer", [props.meetName, `${q.id}`, answer]);
                                                    } else {
                                                        props.calls("SaveUserQAnswer", [props.meetName, `${q.id}`, answer]);
                                                    }
                                                } else {

                                                }
                                            }}
                                            myClassName={classes.answerButton} />
                                    </div>
                                    <div style={{ flex: "1", textAlign: "right" }}>
                                        {props.emojis?.find(e => e.UserQuestionId === q.id)?.Emojie}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Form>
                <h3>پاسخ کاربر مقابل شما</h3>
                {props.answer?.map((ans: UserResponse, index: number) => {
                    return (
                        <>
                            {ans.Answer && ans.Answer !== "" && (
                                <div key={`a${index}`}>
                                    <div className={classes.partnerAnswerHolder}>
                                        {ans.Answer}
                                    </div>
                                    <div className={classes.emojiContainer}>
                                        {myEmojis.find(e => e.ResponseId === ans.ResponseId)?.Emojie}
                                    </div>
                                    <EmojiPicker emojiChosen={(emojiCode: string) => {
                                        setMyEmojis(r => {
                                            return [...r,
                                            {
                                                Emojie: emojiCode,
                                                ResponseId: ans.ResponseId,
                                                MeetQuestionId: null,
                                                UserQuestionId: null
                                            }]
                                        });
                                        props.calls("addEmojie", [props.meetName, `${ans.ResponseId}`, emojiCode])
                                    }} />
                                </div>
                            )}
                        </>
                    )
                })}
            </div>
            <PrimaryButton label={nextButtonLabel} onClick={() => {
                if (props.answer && props.answer.length >= 3) {
                    if (props.isPersonal) {
                        form.resetFields();
                        props.calls("goToDraw", []);
                    } else {
                        form.resetFields();
                        props.calls("Next2OptionQuestion", [`${props.meetName}`]);
                    }
                }
            }} myClassName={classes.nextQButton} />
        </div>
    )
}

export default AnswerCustom;