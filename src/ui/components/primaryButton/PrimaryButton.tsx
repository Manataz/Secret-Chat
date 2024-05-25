import { Button } from "antd";
import classes from "./style.module.scss";

interface IProps {
    label: string;
    onClick: () => void;
    myClassName: string;
    isLoading?: boolean;
}

export const PrimaryButton: React.FC<IProps> = (props) => {
    return(
        <Button loading={props.isLoading} className={`${classes.myButton} ${props.myClassName}`} onClick={props.onClick}>{props.label}</Button>
    )
}

export const SecondaryButton: React.FC<IProps> = (props) => {
    return(
        <Button loading={props.isLoading} className={`${classes.myWhiteButton} ${props.myClassName}`} onClick={props.onClick}>{props.label}</Button>
    )
}