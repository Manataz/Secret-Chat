import classes from "./style.module.scss";
import homeActive from "../../../icons/homeActive.svg"
import homeOff from "../../../icons/homeOff.svg"
import friends from "../../../icons/friends.svg"
import friendsActive from "../../../icons/friendsActive.svg"
import rules from "../../../icons/rules.svg"
import rulesActive from "../../../icons/rulesActive.svg"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
    active: 0 | 1 | 2;
    className?: string;
}

const BottomTab: React.FC<IProps> = (props) => {
    const [myActive, setMyActive] = useState<0 | 1 | 2>(props.active)
    const navigate = useNavigate();

    return (
        <div className={`${props.className} ${classes.bottomTab}`}>
            <div className={`${classes.item} ${myActive === 0 ? classes.active : ``}`} onClick={() => {
                setMyActive(0);
                navigate("/LastMeets");
                }}>
                <img src={myActive === 0 ? friendsActive : friends}/>
                <span>دوستان</span>
            </div>
            <div className={`${classes.item} ${myActive === 1 ? classes.active : ``}`} onClick={() => {
                setMyActive(1);
                navigate("/home");
                }}>
                <img src={myActive === 1 ? homeActive : homeOff}/>
                <span>خانه</span>
            </div>
            <div className={`${classes.item} ${myActive === 2 ? classes.active : ``}`} onClick={() => {
                setMyActive(2);
                navigate("/TermsOfUse");
                }}>
                <img src={myActive === 2 ? rulesActive : rules}/>
                <span>قوانین</span>
            </div>
        </div>
    )
}

export default BottomTab;