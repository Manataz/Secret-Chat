import classes from "./style.module.scss";

const EmojiPicker = () => {
    return(
        <div className={classes.emojiPicker}>
            <div>{String.fromCodePoint(0x1F44D)}</div>
            <div>{String.fromCodePoint(0x1f603)}</div>
            <div>{String.fromCodePoint(0x1F602)}</div>
            <div>{String.fromCodePoint(0x1F60E)}</div>
            <div>{String.fromCodePoint(0x1F610)}</div>
            <div>{String.fromCodePoint(0x1F62D)}</div>
            <div>{String.fromCodePoint(0x1F44E)}</div>
            <div>{String.fromCodePoint(0x1F60D)}</div>
            <div>{String.fromCodePoint(0x1F621)}</div>
        </div>
    )
}

export default EmojiPicker;