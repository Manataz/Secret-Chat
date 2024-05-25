import { Avatar } from "antd";
import classes from "./style.module.scss";
import { QuestionOutlined } from "@ant-design/icons";
import { SecondaryButton } from "../../../components/primaryButton/PrimaryButton";
import EmojiPicker from "../../../components/EmojiPicker/EmojiPicker";

interface IProps {
    meetName: string;
    calls: (methodName: string, args: any[]) => void;
    avatarUrl?: string;
    instagramId?: string;
}

const Completed: React.FC<IProps> = (props) => {
    return (
        <div className={classes.parentContainer}>
            <div className={classes.mainContainer}>
                {!props.instagramId && (
                    <>
                        <Avatar src={props.avatarUrl} icon={<QuestionOutlined />} size={124} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <SecondaryButton
                                label="ادامه می دهم"
                                myClassName={classes.cencelButton}
                                onClick={() => {
                                    props.calls("AddCountineuReaction", [props.meetName, "true"]);
                                }} />
                            <SecondaryButton
                                label="تمایلی به ادامه ندارم"
                                myClassName={classes.cencelButton}
                                onClick={() => {
                                    props.calls("AddCountineuReaction", [props.meetName, "false"]);
                                 }} />
                        </div>
                    </>
                )}
                {props.instagramId && (
                    <>
                        <h4>تبریک! <br />شما یک آشنایی موفق داشتید</h4>
                        <div>آیدی اینستاگرام کاربر مقابل</div>
                        <h3>{props.instagramId}</h3>
                    </>
                )}
            </div>
        </div>
    )
}

export default Completed;