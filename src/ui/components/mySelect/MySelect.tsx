import { Select, SelectProps } from "antd";
import classes from "./style.module.scss";

const MySelect: React.FC<SelectProps> = (props) => {
    return (
        <Select  className={classes.selectStyle} variant="outlined" optionRender={(option) => {
            return <div className={classes.customOption}>{option.label}</div>
        }} {...props}/>
    )
}

export default MySelect;