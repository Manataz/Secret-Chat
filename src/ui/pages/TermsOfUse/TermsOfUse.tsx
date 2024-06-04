import BottomTab from "../../components/BottomTab/BottomTab";
import classes from "./style.module.scss";

const TermsOfUse = () => {
    return (
        <div className={classes.main}>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>

                    <h2>قوانین و مقررات</h2>
                    <p>
                        قوانین و مقررات وب سایت منطبق با قوانین جمهوری اسلامی ایران و قانون تجارت الکترونیک است.
                        در صورتی که تغییری در قوانین درج شده ایجاد شود، در همین صفحه به‌روزرسانی می‌شود.
                        مالکیت مادی و معنوی این وب سایت متعلق به این برند و آدرس اینترنتی Irfriends.com است.
                        کاربر متعهد می‌شود که طبق قوانین جمهوری اسلامی عمل کند.
                        در صورت مشاهده پیام‌های توهین آمیز یا فعالیت مشکوک، حساب کاربری شما مسدود خواهد شد.
                        کاربر حق ندارد اطلاعات اشتباه و گمراه کننده در وب سایت ما منتشر کند
                        برای ثبت نام باید اطلاعات تماس و هویتی حقیقی را به درستی وارد کند.
                        این وب سایت تنها در آشنایی اولیه شما در این فضا دخیل است و هیچ تعهدی در خارج از دنیای مجازی و مشکلات احتمالی در آینده، ندارد.
                    </p>
                </div>

                <BottomTab active={2} className={classes.bottomTab} />
            </div>
        </div>
    )
}

export default TermsOfUse;