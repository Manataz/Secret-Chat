import { Slider } from "antd";
import EmojiPicker from "../../../components/EmojiPicker/EmojiPicker";
import { PrimaryButton } from "../../../components/primaryButton/PrimaryButton";
import classes from "./style.module.scss";
import { useState } from "react";

interface IProps {
    meetName: string;
    calls: (methodName: string, args: any[]) => void;
    avatarUrl: string | undefined;
    nextPage: () => void;
}

const SeeDraw: React.FC<IProps> = (props) => {
    const [score, setScore] = useState<number>(0);
    return (
        <div className={classes.regualrParentContainer}>
            <div className={classes.regualrMainContainer}>
                <h4 style={{ width: "100%", textAlign: "right" }}>قبل از دیدن عکس‌های یکدیگر به هم <br /> چه امتیازی می‌دهید؟</h4>
                <Slider
                    defaultValue={score}
                    onChange={(value) => setScore(value)}
                    max={10}
                    tooltip={{ open: true }}
                    style={{ width: "100%" }} />
                <h4>تصور کاربر مقابل از شما</h4>
                <img style={{ width: "300px", height: "300px", background: "#ffffff" }} src={props.avatarUrl} />
                <EmojiPicker />
            </div>
            <PrimaryButton
                label={"ادامه"}
                onClick={() => {
                    props.calls("AddScore", [props.meetName, `${score}`]);
                    props.nextPage();
                }}
                myClassName={classes.nextQButton} />
        </div>
    )
}

export default SeeDraw;