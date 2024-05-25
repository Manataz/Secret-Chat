import { Avatar, Badge, Button, Flex, Row, Tabs } from "antd";
import BackButton from "../../components/backButton/BackButton";
import { PrimaryButton, SecondaryButton } from "../../components/primaryButton/PrimaryButton";
import classes from "./style.module.scss";
import MySelect from "../../components/mySelect/MySelect";
import { useAppDispatch, useAppSelector } from "../../../repository/hooks";
import { getProviences, personalInfoSelector, getPersonalInfo } from "../../../features/personalInfo.ts/personalInfoSlice";
import { useEffect, useRef, useState } from "react";
import editBadge from "../../../icons/editBadge.svg"
import { HomeOutlined, InfoOutlined, UserOutlined } from "@ant-design/icons";
import BottomTab from "../../components/BottomTab/BottomTab";
import { useNavigate } from "react-router-dom";
import logout from "../../../icons/logout.png";
import { loginSelector, logoutUser } from "../../../features/login/loginSlice";

const Home: React.FC = () => {

    const selectedUsers = useAppSelector(personalInfoSelector);
    const authSelector = useAppSelector(loginSelector);
    const dispatch = useAppDispatch();
    const [provinces, setProvinces] = useState([]);
    const [myProvince, setMyProvince] = useState(0);
    const [gender, setGender] = useState(true);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [chosenProvince, setChosenProvince] = useState(0);
    const navigate = useNavigate();
    const initialized = useRef(false);

    useEffect(() => {
        // setUsers(selectedUsers);
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "province") {
            setProvinces(selectedUsers.data.result.map((s: { provinceId: number, provinceName: string }) => {
                return { value: s.provinceId, label: s.provinceName }
            }))
        }
        if (selectedUsers.data !== undefined && selectedUsers.data.type === "profile") {
            setMyProvince(selectedUsers.data.result?.province?.provinceId);
            setName(selectedUsers.data.result?.name);
            setAvatar(selectedUsers.data.result?.avatar);
        }
    }, [selectedUsers]);

    useEffect(() => {
        if(authSelector && authSelector.data) {
            
        }
    }, [authSelector]);

    useEffect(() => {
        const t = localStorage.getItem("TOKEN");
        if(t === null) {
            navigate("/login")
        }
        if (!initialized.current) {
            initialized.current = true;
            if (provinces.length === 0)
                dispatch(getProviences());
            if (name === "")
                dispatch(getPersonalInfo());
        }
    }, [])

    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
    };

    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <BackButton imgSrc={logout} callFunction={() => {
                    dispatch(logoutUser())
                    localStorage.removeItem("TOKEN");
                    navigate("/Intro");
                }} />
            </div>
            <div className={classes.parentContainer}>
                <div className={classes.mainContainer}>
                    <div style={{ width: "100%" }} onClick={() => {
                        navigate("/personalInfo", { state: { from: "HOME" } });
                    }}>
                        <Badge count={<Avatar size={32} src={editBadge} />} offset={[-6, 143]} >

                            <Flex vertical align="center" justify="center" className={classes.imageHolder}>
                                <Avatar src={avatar} icon={<UserOutlined />} size={124} />
                                <div style={{ marginBottom: "10px" }}>{name}</div>
                            </Flex>
                        </Badge>
                    </div>
                    <div>میخوای از کدوم شهر دوست پیدا کنی؟</div>
                    <Flex dir="horizontal" align="center" justify="space-evenly" style={{ width: "100%" }}>
                        <MySelect
                            className={classes.submitBtn}
                            placeholder="انتخاب شهر"
                            showSearch
                            optionFilterProp="children"
                            onChange={handleChange}
                            options={provinces}
                        />
                        <PrimaryButton myClassName={classes.submitBtn} label="همشهری" onClick={() => {
                            // navigate("/codeVerfication");
                        }} />

                    </Flex>
                    <div>دوست پسر یا دوست دختر؟</div>
                    <Flex dir="horizontal" align="center" justify="space-evenly" style={{ width: "100%" }}>

                        {gender && (<PrimaryButton myClassName={classes.submitBtn} label="پسر" onClick={() => {
                            setGender(true);
                        }} />)}
                        {!gender && (<SecondaryButton myClassName={classes.submitBtn} label="پسر" onClick={() => {
                            setGender(true);
                        }} />)}
                        {!gender && (<PrimaryButton myClassName={classes.submitBtn} label="دختر" onClick={() => {
                            setGender(false);
                        }} />)}
                        {gender && (<SecondaryButton myClassName={classes.submitBtn} label="دختر" onClick={() => {
                            setGender(false);
                        }} />)}

                    </Flex>
                </div>
                <PrimaryButton myClassName={classes.meetButton} label="بریم سر قرار" onClick={() => {
                    navigate("/JoinMeet", { state: { myProvince: myProvince, gender: gender } });
                }} />
                <BottomTab active={1} className={classes.bottomTab} />
            </div>
        </div>

    )
}

export default Home;