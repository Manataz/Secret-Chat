import { Avatar } from "antd";
import classes from "./style.module.scss";
import { HeartFilled, QuestionCircleOutlined } from "@ant-design/icons";
import { SecondaryButton } from "../../../components/primaryButton/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface User {
    Avatar: string;
    Name: string;
}

interface IProps {
    myUser?: User;
    partner?: User;
    meetName?: string;
    calls: (methodName: string, args: any[]) => void
}

const JoinMeetInitial: React.FC<IProps> = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log("jjj", props);
        if(props.partner && props.partner.Name && props.meetName) {
            props.calls("StartGeneralQuestions", [`${props.meetName}`])
        }
    }, [props.partner, props.meetName])
    return (
        <div className={classes.parentContainer}>
            <div className={classes.mainContainer}>
                <Avatar.Group style={{ alignItems: "center" }}>
                    <Avatar size={124} src={props.myUser?.Avatar} style={{ border: "none !important", zIndex: "1" }} />
                    <Avatar size={64} icon={<HeartFilled />} style={{ background: "#FD397F", zIndex: "2" }} />
                    <Avatar size={124} icon={<QuestionCircleOutlined />} src={props.partner?.Avatar} />
                </Avatar.Group>
                <SecondaryButton label="لغو جستجو" myClassName={classes.cencelButton} onClick={() => { navigate("/home") }} />
            </div>
        </div>
    )
}

export default JoinMeetInitial;
