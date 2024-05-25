import { Button } from "antd";
import { Link } from "react-router-dom";
import classes from "./style.module.scss";
import backIcon from "../../../icons/back.svg";

interface IProps {
    backUrl?: string;
    callFunction?: () => void;
    imgSrc?: string;
}

const BackButton: React.FC<IProps> = (props) => {
    return (
        <div onClick={props.callFunction}>
            {props.backUrl && (
                <Link to={props.backUrl} className={classes.btnStyles}>
                    <img src={props.imgSrc ?? backIcon} />
                </Link>
            )}
            {!props.backUrl && (
                <div className={classes.imgHolder}>
                    <img src={props.imgSrc ?? backIcon} />
                </div>
            )}
        </div>
    )
}

export default BackButton;