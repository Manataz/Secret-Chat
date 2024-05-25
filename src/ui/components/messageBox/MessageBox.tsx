import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { useEffect } from "react";

interface IProps {
    type: NoticeType;
    content: string;
}

const MessageBox: React.FC<IProps> = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        messageApi.open({
            type: props.type,
            content: props.content,
        })
    }, [])
    return <div style={{width: "100%", height: "100%"}}>{contextHolder}</div>
}

export default MessageBox;