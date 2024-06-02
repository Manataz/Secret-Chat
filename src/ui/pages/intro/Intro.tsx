import { Button, Flex } from "antd";
import classes from "./style.module.scss"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Intro = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (token !== null) {
      navigate("./home")
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">

        <Flex vertical justify="space-between" align="center" gap={90}>
          <img src={require("./../../../introImage.png")}></img>
          <div className={classes.fullWidth}>
            <Link to="/signup" replace><Button className={classes.fullWidthBtn} size="large">ثبت نام</Button></Link>

            <div className={classes.haveAccount}>
              <Link to="/login" replace style={{ color: "white " }}>ورود</Link>
              <div className={classes.haveAccountTxt}>
                اکانت دارید؟
              </div>
            </div>

          </div>
        </Flex>
      </header>
    </div>

  )
}

export default Intro;