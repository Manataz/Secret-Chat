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

const JoinMeet: React.FC = () => {
    const initialized = useRef(false);

    // const sheetRef = useRef<BottomSheetRef | null>(null)
    const [form] = Form.useForm();
    const { newMessage, events, isConnected, tryAnotherConnect } = Connector();
    const { state } = useLocation();
    const [modelRecieved, setModelRecieved] = useState<any>();
    const [openReasonModal, setOpenReasonModal] = useState<boolean>(false);
    const [isYesNo, setIsYesNo] = useState<boolean>(false);
    const [personalQ, setPersonalQ] = useState<boolean>(false);
    const [meetName, setMeetName] = useState<string>();
    const [instagramId, setInstagramId] = useState<string>();
    const [reaction, setReaction] = useState<boolean>();
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

    const handleFinish = (values: any) => {
        setOpenReasonModal(false);
        newMessage("endMeet", [meetName, values.reason]);
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
        if (messageRecieved?.PartnerResponse && messageRecieved?.PartnerResponse?.Answer !== null) {
            setPartnerResponse(messageRecieved?.PartnerResponse);
        }
        if (currentScreen === "ANSWERCUSTOMQ") {
            setMultipleResponses(r => {
                if (messageRecieved?.PartnerResponse) {
                    return [...r, messageRecieved?.PartnerResponse]
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
        } else if (messageRecieved && messageRecieved.StatusCode === 400) {
            if (messageRecieved.Message === "NextGeneralQ" && meetName) {
                newMessage("NextGeneralQuestion", [`${meetName}`])
                setIsYesNo(false);
                setCurrentScreen("GENERALQ")
            }
            if (messageRecieved.Message === "PersonalQ" && meetName) {
                newMessage("NextPersonalQuestion", [`${meetName}`])
                setMultipleResponses([]);
                setCurrentScreen("ANSWERCUSTOMQ")
            }
            if (messageRecieved.Message === "UserQuestion" && meetName) {
                setCurrentScreen("ASKQ")
            }
        } else {
            if (messageRecieved) {
                if (messageRecieved?.MeetInfo?.Partner?.Name) {
                    // navigate("/questions");
                } else if (messageRecieved.Message === "Next2OptionQ" && meetName) {
                    newMessage("Next2OptionQuestion", [`${meetName}`])
                    setIsYesNo(true);
                    setCurrentScreen("GENERALQ")
                } else if (messageRecieved.Message === "Paint" && meetName) {
                    setCurrentScreen("DRAW")
                } else if (messageRecieved?.Questions !== undefined && messageRecieved?.Questions?.length === 3) {
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
        if (!initialized.current) {
            initialized.current = true;
            
            if (isConnected) {
                newMessage("joinMeet", [`${myProvince}`, `${gender}`])
            } else {
                console.warn("isConnected", isConnected)
                tryAnotherConnect();
            }
        }
    }, [isConnected]);

    return (
        <div className={classes.main}>
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
                    key={`${meetName}-${isYesNo}`}
                    expirationDate={singleQuestion?.expireDate ?? ""}
                    answer={partnerResponse?.Answer ?? ""}
                    type={isYesNo}
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
                            <MyInput placeholder="پاسخ خود را وارد کنید. (حداکثر 20 کاراکتر)"/>
                        </Form.Item>
                    </Form>
                </div>
                <PrimaryButton
                    onClick={() => { 
                        form.submit();
                        navigate("/home")
                     }}
                    label="ثبت"
                    myClassName={classes.modalButton} />
            </Modal>
        </div>
    )
}

export default JoinMeet;
