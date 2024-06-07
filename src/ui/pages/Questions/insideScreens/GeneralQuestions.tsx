import { Avatar, Col, Form, Progress, Row } from "antd";
import MyInput from "../../../components/MyInput/MyInput";
import { SmileOutlined } from "@ant-design/icons";
import { PrimaryButton, SecondaryButton } from "../../../components/primaryButton/PrimaryButton";
import classes from "./style.module.scss";
import Column from "antd/es/table/Column";
import EmojiPicker from "../../../components/EmojiPicker/EmojiPicker";
import { useEffect, useState } from "react";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import moment from "moment";
import { EmojiResponse } from "../JoinMeet";

interface IProps {
    question: string;
    questionId: string;
    meetName: string;
    expirationDate: string;
    type: boolean;
    answer?: string;
    answerId?: number;
    nextStep?: () => void;
    emojis?: EmojiResponse[];
    calls: (methodName: string, args: any[]) => void
}

const GeneralQuestions: React.FC<IProps> = (props) => {
    const [form] = Form.useForm();
    const [nextButtonLabel, setNextButtonLabel] = useState<string>("...در انتظار");
    const [myEmojiCode, setMyEmojiCode] = useState<string>();
    const [responseEmojiCode, setResponseEmojiCode] = useState<string>();
    const [timeLeftStr, setTimeLeftStr] = useState("");
    const [yesNoAnswer, setYesNoAnswer] = useState<boolean>();
    const [minutes, setMinutes] = useState(moment(props.expirationDate).diff(moment(), 'minutes'))
    const [seconds, setSeconds] = useState(moment(props.expirationDate).diff(moment(), 'seconds'))
    const initialTime = minutes * 60 + seconds;
    const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds);
    useEffect(() => {
        if (props.answer && props.answer !== undefined) {
            setNextButtonLabel("سوال بعدی");
        } else {
            setNextButtonLabel("...در انتظار");
        }
    }, [props.answer]);

    useEffect(() => {
        if (props.emojis) {
            setResponseEmojiCode(props.emojis.find(e => `${e.MeetQuestionId}` === props.questionId)?.Emojie);
        }
    }, [props.emojis])


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

    return (
        <div className={classes.regualrParentContainer}>
            <div className={classes.regualrMainContainer}>
                <h3>سوال شما</h3>
                <Form form={form} layout="vertical" style={{ width: "100%" }}>
                    <Form.Item
                        label={props.question}
                        name={"answer"}>
                        {props.type && (
                            <>
                                {yesNoAnswer === undefined && (
                                    <>
                                        <SecondaryButton myClassName={classes.submitBtn} label="نه" onClick={() => {
                                            setYesNoAnswer(false);
                                        }} />
                                        <SecondaryButton myClassName={classes.submitBtn} label="بله" onClick={() => {
                                            setYesNoAnswer(true);
                                        }} />
                                    </>
                                )}
                                {yesNoAnswer !== undefined && yesNoAnswer === false && (
                                    <PrimaryButton myClassName={classes.submitBtn} label="نه" onClick={() => {
                                        setYesNoAnswer(false);
                                    }} />
                                )}
                                {yesNoAnswer !== undefined && yesNoAnswer === true && (
                                    <SecondaryButton myClassName={classes.submitBtn} label="نه" onClick={() => {
                                        setYesNoAnswer(false);
                                    }} />
                                )}
                                {yesNoAnswer !== undefined && yesNoAnswer === true && (
                                    <PrimaryButton myClassName={classes.submitBtn} label="بله" onClick={() => {
                                        setYesNoAnswer(true);
                                    }} />
                                )}
                                {yesNoAnswer !== undefined && yesNoAnswer === false && (
                                    <SecondaryButton myClassName={classes.submitBtn} label="بله" onClick={() => {
                                        setYesNoAnswer(true);
                                    }} />
                                )}


                            </>
                        )}
                        {!props.type && (
                            <MyInput placeholder="پاسخ خود را وارد کنید( حداکثر 20 کارکتر)" />
                        )}
                    </Form.Item>
                    <div className={classes.emojiContainer} style={{ position: "relative", top: "-20px" }}>
                        {responseEmojiCode}
                    </div>
                    <div className={classes.progressContainer}>
                        <PrimaryButton
                            label="ارسال پاسخ"
                            onClick={() => {
                                const answer = form.getFieldValue("answer");
                                if (answer !== "" || yesNoAnswer !== undefined) {
                                    if (props.type) {
                                        props.calls("Save2OptionQAnswer", [props.meetName, props.questionId, `${yesNoAnswer}`])
                                    } else {
                                        props.calls("SaveGeneralQAnswer", [props.meetName, props.questionId, answer])
                                    }
                                } else {

                                }
                            }}
                            myClassName={classes.answerButton} />
                        <div className={classes.timerContainer}>
                            <div className={classes.timer}>{timeLeftStr}</div>
                            <Progress
                                percent={(timeLeft * 100) / initialTime}
                                size={[150, 10]}
                                key={timeLeft}
                                trailColor="#ffffff"
                                showInfo={false}
                                strokeColor={{ from: "#EA3E5C", to: "#931372" }}
                                strokeLinecap="round" />
                        </div>
                    </div>
                </Form>
                <h3>پاسخ کاربر مقابل شما</h3>
                <div className={classes.partnerAnswerHolder}>
                    {props.answer}
                </div>
                <div className={classes.emojiContainer}>
                    {myEmojiCode}
                </div>
                <EmojiPicker emojiChosen={(emojiCode: string) => {
                    if(props.answerId) {
                        setMyEmojiCode(emojiCode)
                        props.calls("addEmojie", [props.meetName, `${props.answerId}`, emojiCode])
                    }
                }} />
            </div>
            <PrimaryButton label={nextButtonLabel} onClick={() => {
                if (props.answer) {
                    if (props.nextStep) {
                        console.error("fourth")    
                        props.nextStep()
                    }
                    // form.resetFields();
                    setYesNoAnswer(undefined);
                    if (props.type) {
                        props.calls("Next2OptionQuestion", [`${props.meetName}`])
                    } 
                }
            }} myClassName={classes.nextQButton} />
        </div>
    )
}

export default GeneralQuestions;