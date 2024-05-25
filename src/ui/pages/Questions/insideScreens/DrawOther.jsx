import { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { PrimaryButton } from "../../../components/primaryButton/PrimaryButton";
import classes from "./style.module.scss";
import { Button, Progress } from "antd";
import eraser from "../../../../icons/eraser.svg";
import pencil from "../../../../icons/pencil.svg";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useAppDispatch, useAppSelector } from "../../../../repository/hooks";
import { paintPartnerAvatar, personalInfoSelector } from "../../../../features/personalInfo.ts/personalInfoSlice";

const DrawOther = ({meetName,calls }) => {
    const drawRef = useRef();
    const [nextButtonLabel, setNextButtonLabel] = useState("...در انتظار");
    const [timeLeftStr, setTimeLeftStr] = useState("");
    const [minutes, setMinutes] = useState(3)
    const [seconds, setSeconds] = useState(0)
    const [timeLeft, setTimeLeft] = useState(180);
    const dispatch = useAppDispatch();

   

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
        if (timeLeft === 0) {
            calls("Next2OptionQuestion", [`${meetName}`])
        }
    }, [timeLeft]);

    return (
        <div className={classes.regualrParentContainer}>
            <div className={classes.regualrMainContainer}>
                <h4>به نظرت طرف مقابلت چه شکلیه؟</h4>
                <div className={`${classes.progressContainer} ${classes.standalone}`}>
                    <div className={classes.timerContainer}>
                        <div className={classes.timer}>{timeLeftStr}</div>
                        <Progress
                            percent={timeLeft * 100 / 180}
                            size={[150, 10]}
                            key={timeLeft}
                            trailColor="#ffffff"
                            showInfo={false}
                            strokeColor={{ from: "#EA3E5C", to: "#931372" }}
                            strokeLinecap="round" />
                    </div>
                </div>
                <CanvasDraw
                    ref={drawRef}
                    hideInterface={true}
                    canvasWidth={300}
                    canvasHeight={300}
                    hideGrid={true}
                    onChange={(canvas) => { setNextButtonLabel("ارسال تصویر") }}
                    brushRadius={2} />
                <div className={classes.canvasController}>
                    {/* <Button shape="circle" icon={<img src={pencil} />} /> */}
                    <Button shape="circle" icon={<img src={eraser} />} onClick={() => {
                        drawRef.current?.clear();
                        setNextButtonLabel("...در انتظار")
                    }} />
                </div>
            </div>
            <PrimaryButton
                label={nextButtonLabel}
                onClick={() => {
                    console.log(drawRef.current.canvasContainer.children[1].toDataURL());
                    dispatch(paintPartnerAvatar({ meetName: meetName, file: drawRef.current.canvasContainer.children[1].toDataURL() }))
                }}
                myClassName={classes.nextQButton} />
        </div>
    )
}

export default DrawOther;