import classes from "./style.module.scss";

interface IProps {
    emojiChosen: (emojiCode: string) => void;
}

const EmojiPicker = ({emojiChosen}: IProps) => {
    return(
        <div className={classes.emojiPicker}>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F44D))
            }}>{String.fromCodePoint(0x1F44D)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1f603))
            }}>{String.fromCodePoint(0x1f603)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F602))
            }}>{String.fromCodePoint(0x1F602)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F60E))
            }}>{String.fromCodePoint(0x1F60E)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F610))
            }}>{String.fromCodePoint(0x1F610)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F62D))
            }}>{String.fromCodePoint(0x1F62D)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F44E))
            }}>{String.fromCodePoint(0x1F44E)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F60D))
            }}>{String.fromCodePoint(0x1F60D)}</div>
            <div onClick={() => {
                emojiChosen(String.fromCodePoint(0x1F621))
            }}>{String.fromCodePoint(0x1F621)}</div>
        </div>
    )
}

export default EmojiPicker;