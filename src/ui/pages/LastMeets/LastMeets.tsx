import { useEffect, useState } from "react";
import BottomTab from "../../components/BottomTab/BottomTab";
import { PrimaryButton, SecondaryButton } from "../../components/primaryButton/PrimaryButton";
import classes from "./style.module.scss"
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { getFailMeets, getReportMessages, getSuccessMeets, personalInfoSelector, sendReport } from "../../../features/personalInfo.ts/personalInfoSlice";
import { Avatar, Divider, Form, Modal } from "antd";
import instagram from "../../../icons/instagram.png";
import MySelect from "../../components/mySelect/MySelect";

interface User {
    userId: number;
    name: string;
    avatar: string;
    instagramId: string;
    failReason?: string;
}

interface ReportMessage {
    messageId: number;
    message: string;
}

const LastMeets = () => {
    const [wasSuccess, setWasSuccess] = useState<boolean>(true);
    const [successMeets, setSuccessMeets] = useState<User[]>([]);
    const [failMeets, setFailMeets] = useState<User[]>([]);
    const [form] = Form.useForm();
    const [reportMessages, setReportMessages] = useState<ReportMessage[]>([]);
    const selectedUsers = useAppSelector(personalInfoSelector);
    const dispatch = useAppDispatch();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<number>(0);

    const openReportModal = (userId: number) => {
        setSelectedUserId(userId);
        setModalOpen(true)
    }

    useEffect(() => {
        // setUsers(selectedUsers);
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "ok") {
            setSuccessMeets(selectedUsers.data.result)
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "fail") {
            setFailMeets(selectedUsers.data.result)
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "reportM") {
            setReportMessages(selectedUsers.data.result)
        }
    }, [selectedUsers]);

    useEffect(() => {
        dispatch(getSuccessMeets());
        dispatch(getFailMeets());
        dispatch(getReportMessages());
    }, []);

    const handleFinish = (values: any) => {
        dispatch(sendReport({ ...values, userId: selectedUserId }));
    }

    return (
        <div className={classes.main}>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>
                    <div className={classes.tabHolder}>
                        {wasSuccess === false && (
                            <PrimaryButton myClassName={classes.submitBtn} label="آشنایی های ناموفق" onClick={() => {
                                setWasSuccess(false);
                            }} />
                        )}
                        {wasSuccess === true && (
                            <SecondaryButton myClassName={classes.submitBtn} label="آشنایی های ناموفق" onClick={() => {
                                setWasSuccess(false);
                            }} />
                        )}
                        {wasSuccess === true && (
                            <PrimaryButton myClassName={classes.submitBtn} label="آشنا شده" onClick={() => {
                                setWasSuccess(true);
                            }} />
                        )}
                        {wasSuccess === false && (
                            <SecondaryButton myClassName={classes.submitBtn} label="آشنا شده" onClick={() => {
                                setWasSuccess(true);
                            }} />
                        )}

                    </div>
                    <div className={classes.tabBody}>
                        {wasSuccess && (
                            <>
                                {successMeets?.map(u => {
                                    return (
                                        <div style={{ width: "100%" }}>
                                            <div className={classes.userItem}>
                                                <PrimaryButton
                                                    label="گزارش"
                                                    myClassName={classes.reportButton}
                                                    onClick={() => openReportModal(u.userId)} />
                                                <div className={classes.nameHolder}>
                                                    <span style={{ fontWeight: "700", fontSize: "15px" }}>{u.name}</span>
                                                    <span className={classes.idHolder}><img src={instagram} />{u.instagramId}</span>
                                                </div>
                                                <Avatar size={70} src={u.avatar} shape="circle" />
                                            </div>
                                            <div className={classes.myBorder} />

                                        </div>
                                    )
                                })}
                            </>
                        )}
                        {!wasSuccess && (
                            <>
                                {failMeets?.map(u => {
                                    return (
                                        <div className={classes.userItem}>
                                            <PrimaryButton
                                                label="گزارش"
                                                myClassName={classes.reportButton}
                                                onClick={() => openReportModal(u.userId)} />
                                            <div className={classes.nameHolder}>
                                                <span>{u.name}</span>
                                                <span>{u.failReason ?? "-"}</span>
                                            </div>
                                            <Avatar size={70} src={u.avatar} shape="circle" />
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
                <BottomTab active={0} />
            </div>
            <Modal
                title={<span style={{ fontFamily: "Mikhak", width: "90%", textAlign: "end" }}>تخلف مورد نظر را انتخاب کنید</span>}
                centered
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={<></>}>
                <div>
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        <Form.Item name={"messageId"}>
                            <MySelect
                                className={classes.submitBtn}
                                showSearch
                                optionFilterProp="children"
                                options={reportMessages.map(r => { return { value: r.messageId, label: r.message } })}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <PrimaryButton
                    onClick={() => { form.submit() }}
                    label="ارسال گزارش"
                    myClassName={classes.modalButton} />
            </Modal>
        </div>
    )
}

export default LastMeets;