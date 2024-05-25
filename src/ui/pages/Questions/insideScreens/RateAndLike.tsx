import { Avatar, Progress, Slider } from "antd";
import classes from "./style.module.scss";
import { PrimaryButton } from "../../../components/primaryButton/PrimaryButton";
import { Rate } from "antd";
import imgLike from "../../../../icons/thumbUp.png";
import imgDislike from "../../../../icons/thumbDown.png";
import { useState } from "react";

interface IProps {
    meetName: string;
    calls: (methodName: string, args: any[]) => void;
    nextPage: () => void;
    rankResponse: number;
    myRank: number;
}

const RateAndLike: React.FC<IProps> = (props) => {
    const [like, setLike] = useState<boolean>();
    return (
        <div className={classes.regualrParentContainer}>
            <div className={classes.regualrMainContainer}>
                <h4 style={{ width: "100%", textAlign: "right" }}>قبل از دیدن عکس‌های یکدیگر به هم <br /> چه امتیازی می‌دهید؟</h4>
                <Slider defaultValue={props.myRank} max={10} tooltip={{ open: true }} style={{ width: "100%" }} disabled />
                <h4>امتیاز کاربر مقابل به شما</h4>
                <Slider defaultValue={props.rankResponse} max={10} tooltip={{ open: true }} style={{ width: "100%" }} disabled />
                <h4>آیا حاضرید با هم سر قرار برید؟</h4>
                <div className={classes.likeHolder}>
                    <Avatar
                        size={like === false ? 65 : 55}
                        src={imgDislike}
                        style={{ border: like === false ? "4px solid #EA3E5C" : "none" }}
                        onClick={() => {setLike(false)}} />
                    <Avatar
                        size={like ? 65 : 55}
                        src={imgLike}
                        style={{ border: like ? "4px solid #EA3E5C" : "none" }}
                        onClick={() => {setLike(true)}} />
                </div>
            </div>
            <PrimaryButton
                label={"ثبت نظر"}
                onClick={() => {
                    props.calls("AddLikeReaction", [props.meetName, `${like}`]);
                    props.nextPage();
                }}
                myClassName={classes.nextQButton} />
        </div>
    )
}

export default RateAndLike;