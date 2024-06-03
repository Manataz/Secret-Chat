import BottomTab from "../../components/BottomTab/BottomTab";
import classes from "./style.module.scss";

const TermsOfUse = () => {
    return (
        <div className={classes.main}>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>

                    <h2>قوانین و مقررات</h2>
                </div>

                <BottomTab active={2} className={classes.bottomTab} />
            </div>
        </div>
    )
}

export default TermsOfUse;