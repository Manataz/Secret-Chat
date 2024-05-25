import { Input } from "antd";
import { ChangeEvent } from "react";
import classes from "./style.module.scss";

interface IProps {
    customClasses?: string;
    onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    prefix?: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
}

const MyInput: React.FC<IProps> = (props) => {
    return (
        <div className={`${props.customClasses} ${classes.inputContainer}`}>
            <Input
                onChange={props.onChange}
                value={props.value}
                prefix={props.prefix}
                placeholder={props.placeholder}
                disabled={props.disabled} />
        </div>
    )
}

export default MyInput;