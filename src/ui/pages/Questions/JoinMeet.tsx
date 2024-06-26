import { useLocation, useNavigate } from "react-router-dom";
import classes from "./style.module.scss"
import { useEffect, useRef, useState } from "react";
import Connector from "../../../repository/signalR/signalr-connection";
import JoinMeetInitial from "./insideScreens/JoinMeetInitial";
import GeneralQuestions from "./insideScreens/GeneralQuestions";
import BackButton from "../../components/backButton/BackButton";
import AskQuestions from "./insideScreens/AskQuestions";
import AnswerCustom from "./insideScreens/AnswerCustom";
import { Question, UserResponse } from "./models/models";
import DrawOther from "./insideScreens/DrawOther";
import { useAppSelector } from "../../../repository/hooks";
import { personalInfoSelector } from "../../../features/personalInfo.ts/personalInfoSlice";
import SeeDraw from "./insideScreens/SeeDraw";
import RateAndLike from "./insideScreens/RateAndLike";
import Completed from "./insideScreens/Completed";
import giveup from "../../../icons/giveup.png";
import { Form, Modal } from "antd";
import { PrimaryButton } from "../../components/primaryButton/PrimaryButton";
import MyInput from "../../components/MyInput/MyInput";

declare type ScreenStates = "JOINMEET" | "GENERALQ" | "ASKQ" | "ANSWERCUSTOMQ" | "YESNOQ" | "PESONALQ" | "DRAW" | "SEEART" | "RATE" | "COMPLETED";

export interface EmojiResponse {
    ResponseId: number;
    Emojie: string;
    MeetQuestionId: number | null;
    UserQuestionId: number | null;
}

const JoinMeet: React.FC = () => {
    const initialized = useRef(false);

    // const sheetRef = useRef<BottomSheetRef | null>(null)
    const [form] = Form.useForm();
    const { state } = useLocation();
    const [modelRecieved, setModelRecieved] = useState<any>();
    const [openReasonModal, setOpenReasonModal] = useState<boolean>(false);
    const [endMeetReason, setEndMeetReason] = useState<string>();
    const [openEndMeetModal, setOpenEndMeetModal] = useState<boolean>(false);
    const [nextStep, setNextStep] = useState<() => void>();
    const [nextStepStr, setNextStepStr] = useState<string>("");
    const [emojis, setEmojis] = useState<EmojiResponse[]>();
    const [isYesNo, setIsYesNo] = useState<boolean>(false);
    const [personalQ, setPersonalQ] = useState<boolean>(false);
    const [meetName, setMeetName] = useState<string>();
    const [instagramId, setInstagramId] = useState<string>();
    const [reaction, setReaction] = useState<boolean>();
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [singleQuestion, setSingleQuestion] = useState<Question>();
    const [multipleQuestions, setMultipleQuestions] = useState<Question[]>();
    const [partnerResponse, setPartnerResponse] = useState<UserResponse>();
    const [multipleResponses, setMultipleResponses] = useState<UserResponse[]>([]);
    const [paintedAvatarUrl, setPaintedAvatarUrl] = useState<string>();
    const [rankResponse, setRankResponse] = useState<number>(0);
    const [myRank, setMyRank] = useState<number>(0);
    const [currentScreen, setCurrentScreen] = useState<ScreenStates>("JOINMEET");
    const selectedUsers = useAppSelector(personalInfoSelector);
    const navigate = useNavigate();
    const { myProvince } = state;
    const { gender } = state;
    const { newMessage, events, isConnected } = Connector(() => { newMessage("joinMeet", [`${myProvince}`, `${gender}`]) });

    const handleFinish = (values: any) => {
        if (values.reason !== undefined && values.reason !== "") {
            setOpenReasonModal(false);
            newMessage("endMeet", [meetName, values.reason]);
            navigate("/home");
        }
    }

    useEffect(() => {
        if (events) events((username, message) => {
            const m = JSON.parse(username);
            console.warn(m);
            if (m.MeetName) {
                setMeetName(m.MeetName)
            }
            setModelRecieved(m);

        });
    }, [events]);

    useEffect(() => {
        if (meetName && modelRecieved) {
            pageNavigation(modelRecieved);
        }

    }, [meetName, modelRecieved]);

    useEffect(() => {
        if (currentScreen === "GENERALQ") {
            setNextStep(() => {
                if (isYesNo) {
                    newMessage("Next2OptionQuestion", [`${meetName}`])
                    setIsYesNo(true);
                    setCurrentScreen("GENERALQ");
                } else {
                    newMessage("NextGeneralQuestion", [`${meetName}`])
                    setIsYesNo(false);
                    setCurrentScreen("GENERALQ");
                }
            })
        }
    }, [currentScreen]);

    useEffect(() => {
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "edit") {
            newMessage("GetPaintedAvatars", [meetName])
            setPaintedAvatarUrl(selectedUsers.data.result);
            setCurrentScreen("SEEART");
        }
        return () => {
            console.log("component unmounting...");
        };
    }, [selectedUsers]);

    const pageNavigation = (messageRecieved: any) => {
        setPageLoading(false);
        if (messageRecieved?.PartnerResponse && messageRecieved?.PartnerResponse?.Answer !== null) {
            setPartnerResponse(messageRecieved?.PartnerResponse);
        }
        if (currentScreen === "ANSWERCUSTOMQ") {
            setMultipleResponses(r => {
                if (messageRecieved?.PartnerResponse) {
                    if (r.findIndex(f => f.ResponseId === messageRecieved?.PartnerResponse?.ResponseId) >= 0) {
                        return [...r]
                    } else {
                        return [...r, messageRecieved?.PartnerResponse]
                    }
                } else {
                    return [...r]
                }
            })
        }
        if (messageRecieved.Question) {
            setSingleQuestion({
                id: messageRecieved?.Question?.MeetQuestionId,
                title: messageRecieved?.Question?.QTitle,
                expireDate: messageRecieved?.Question?.ExpireDate
            })
            setPartnerResponse(undefined);
            setCurrentScreen("GENERALQ");
        }
        if (messageRecieved && messageRecieved.StatusCode === 400) {
            if (messageRecieved.Message === "NextGeneralQ" && meetName) {
                setNextStepStr("General");
                setNextStep(() => {
                    console.error("scond");

                    newMessage("NextGeneralQuestion", [`${meetName}`])
                    setIsYesNo(false);
                    setCurrentScreen("GENERALQ")
                })
            }
            if (messageRecieved.Message === "PersonalQ" && meetName) {
                setNextStepStr("Personal");
                setNextStep(() => {
                    newMessage("NextPersonalQuestion", [`${meetName}`])
                    setMultipleResponses([]);
                    setCurrentScreen("ANSWERCUSTOMQ")
                })
            }
            if (messageRecieved.Message === "UserQuestion" && meetName) {
                setNextStepStr("User");
                newMessage("StartUserQuestion", [meetName])
            }
            if (messageRecieved.Message === "wait" && meetName) {
                setPageLoading(true);
            }
        } else {
            if (messageRecieved) {
                if (messageRecieved?.MeetInfo?.Partner?.Name) {
                    // navigate("/questions");
                } else if (messageRecieved.Message === "emojie" && meetName) {
                    setEmojis(r => {
                        if (r) {
                            return [...r, messageRecieved.Response];
                        } else {
                            return [messageRecieved.Response];
                        }
                    });
                } else if (messageRecieved.Message === "EndMeet" && meetName) {
                    setEndMeetReason(messageRecieved.Reason)
                    setOpenEndMeetModal(true);
                } else if (messageRecieved.Message === "NextGeneralQ" && meetName) {
                    setNextStepStr("General");
                    setCurrentScreen("GENERALQ");
                } else if (messageRecieved.Message === "Next2OptionQ" && meetName) {
                    setNextStepStr("Option");
                }  else if (messageRecieved?.Questions !== undefined && messageRecieved?.Questions?.length === 3) {
                    setMultipleQuestions(messageRecieved?.Questions?.map((qp: any) => {
                        return { id: qp.UserQId, title: qp.Title, expireDate: qp.ExpireTime }
                    }))
                    setPersonalQ(false);
                    setMultipleResponses([]);
                    setCurrentScreen("ANSWERCUSTOMQ")
                } else if (messageRecieved?.Questions !== undefined && messageRecieved?.Questions?.length === 5) {
                    setMultipleQuestions(messageRecieved?.Questions?.map((qp: any) => {
                        return { id: qp.MeetQuestionId, title: qp.QTitle, expireDate: qp.ExpireDate }
                    }))
                    setPersonalQ(true)
                    setMultipleResponses([]);
                    setCurrentScreen("ANSWERCUSTOMQ")
                }       else if (messageRecieved.Message === "success" && meetName) {
                    setNextStepStr(s => {
                        if (s === "Option") {
                            setIsYesNo(true);
                            setCurrentScreen("GENERALQ");
                            return "OptionSuccess";
                        } else if (s === "General") {
                            setIsYesNo(false);
                            setCurrentScreen("GENERALQ");
                            return "GeneralSuccess";
                        } else {
                            setIsYesNo(false);
                            return s;
                        }
                    });
                } else if (messageRecieved.Message === "UserQuestion" && meetName) {
                    setNextStepStr(s => {
                        if (s === "User") {
                            setCurrentScreen("ASKQ");
                            return "UserSuccess"
                        } else {
                            newMessage("StartUserQuestion", [meetName])
                            return "User";
                        }
                    });
                } else if (messageRecieved.Message === "Paint" && meetName) {
                    setNextStepStr("Paint");
                    newMessage("StartPaintAvatar", [meetName]);
                    setCurrentScreen("DRAW");
                } else if (messageRecieved?.Result !== undefined && messageRecieved?.Result?.partner) {
                    setPaintedAvatarUrl(messageRecieved?.Result?.partner)
                    setCurrentScreen("SEEART")
                } else if (messageRecieved?.PartnerScore !== undefined && messageRecieved?.Message === undefined) {
                    setRankResponse(messageRecieved?.PartnerScore);
                } else if (messageRecieved?.PartnerReaction !== undefined && messageRecieved?.PartnerInstagram === undefined) {
                    setReaction(messageRecieved?.PartnerReaction);
                } else if (messageRecieved?.PartnerInstagram) {
                    setInstagramId(messageRecieved?.PartnerInstagram);
                }
            }
        }
    }

    useEffect(() => {
        console.warn("isConnected", isConnected)
        if (!initialized.current) {
            initialized.current = true;
        }
        if (meetName !== undefined)
            newMessage("joinMeet", [`${myProvince}`, `${gender}`]);
    }, [isConnected]);

    return (
        <div className={`${classes.main}`}>
            {currentScreen !== "JOINMEET" && currentScreen !== "COMPLETED" && (
                <div className={classes.header}>
                    <BackButton imgSrc={giveup} callFunction={() => {
                        setOpenReasonModal(true);
                    }} />
                </div>
            )}
            {currentScreen === "JOINMEET" && (
                <JoinMeetInitial
                    myUser={modelRecieved?.MeetInfo?.CurrentUser}
                    partner={modelRecieved?.MeetInfo?.Partner}
                    meetName={modelRecieved?.MeetName}
                    calls={newMessage} />
            )}
            {currentScreen === "GENERALQ" && (
                <GeneralQuestions
                    question={singleQuestion?.title ?? ""}
                    questionId={`${singleQuestion?.id}`}
                    meetName={meetName ?? ""}
                    key={`${meetName}-${isYesNo}-${singleQuestion?.id}-${nextStep === undefined}`}
                    expirationDate={singleQuestion?.expireDate ?? ""}
                    answer={partnerResponse?.Answer ?? ""}
                    answerId={partnerResponse?.ResponseId}
                    emojis={emojis}
                    type={isYesNo}
                    nextStep={() => {
                        if (nextStepStr === "General") {
                            newMessage("NextGeneralQuestion", [`${meetName}`])
                            setIsYesNo(false);
                            setCurrentScreen("GENERALQ");
                        } else if (nextStepStr === "Option" && isYesNo) {
                            newMessage("Next2OptionQuestion", [`${meetName}`])
                            setIsYesNo(true);
                            setCurrentScreen("GENERALQ");
                        }
                    }}
                    calls={(methodName: string, args: any[]) => {
                        newMessage(methodName, args);
                        if (methodName === "Next2OptionQuestion")
                            setIsYesNo(true);
                    }} />
            )}
            {currentScreen === "ASKQ" && (
                <AskQuestions calls={newMessage} meetName={meetName ?? ""} />
            )}
            {currentScreen === "ANSWERCUSTOMQ" && (
                <AnswerCustom
                    question={multipleQuestions ?? []}
                    answer={multipleResponses ? multipleResponses : []}
                    emojis={emojis}
                    nextStep={() => {
                        if (nextStepStr === "Option") {
                            newMessage("Next2OptionQuestion", [meetName]);
                        }
                    }}
                    calls={(methodName: string, args: any[]) => {
                        if (methodName === "goToDraw") {
                            setCurrentScreen("DRAW")
                        } else {
                            setIsYesNo(true);
                            newMessage(methodName, args);
                        }
                    }}
                    isPersonal={personalQ}
                    meetName={meetName ?? ""} />
            )}
            {currentScreen === "DRAW" && (
                <DrawOther
                    calls={newMessage}
                    meetName={meetName ?? ""} />
            )}
            {currentScreen === "SEEART" && (
                <SeeDraw
                    calls={(methodName, args) => {
                        if (args[1] && Number(args[1]) !== Number.NaN) {
                            setMyRank(Number(args[1]));
                        }
                        newMessage(methodName, args);
                    }}
                    meetName={meetName ?? ""}
                    avatarUrl={paintedAvatarUrl}
                    nextPage={() => setCurrentScreen("RATE")} />
            )}
            {currentScreen === "RATE" && (
                <RateAndLike
                    calls={newMessage}
                    meetName={meetName ?? ""}
                    nextPage={() => setCurrentScreen("COMPLETED")}
                    key={`${meetName}-${rankResponse}-${myRank}`}
                    rankResponse={rankResponse}
                    myRank={myRank} />
            )}
            {currentScreen === "COMPLETED" && (
                <Completed
                    calls={newMessage}
                    meetName={meetName ?? ""}
                    key={`${meetName}-${instagramId}`}
                    avatarUrl={""}
                    instagramId={instagramId} />
            )}
            <Modal
                title={"علت ادامه ندادن شما چه بود؟"}
                centered
                open={openReasonModal}
                onCancel={() => setOpenReasonModal(false)}
                footer={<></>}>
                <div className={classes.modalParent}>
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        <Form.Item name={"reason"} rules={[
                            {
                                required: true,
                                message: 'ذکر دلیل اجباریست',
                            },
                        ]}>
                            <MyInput placeholder="پاسخ خود را وارد کنید. (حداکثر 20 کاراکتر)" />
                        </Form.Item>
                    </Form>
                </div>
                <PrimaryButton
                    onClick={() => {
                        form.submit();
                    }}
                    label="ثبت"
                    myClassName={classes.modalButton} />
            </Modal>
            <Modal
                title={"قرار لغو شد"}
                centered
                open={openEndMeetModal}
                closable={false}
                onCancel={() => setOpenEndMeetModal(false)}
                footer={<></>}>
                <div className={classes.modalParent}>
                    <h4>دلیل:</h4>
                    <ul>
                        <li>{endMeetReason}</li>
                    </ul>
                </div>
                <PrimaryButton
                    onClick={() => {
                        newMessage("endMeet", [""]);
                        navigate("../home");
                    }}
                    label="باشه"
                    myClassName={classes.modalButton} />
            </Modal>
        </div>
    )
}

export default JoinMeet;
