interface Question {
    question: string;
    questionId: string;
}
interface Answer {
    answer: string;
    answerId: string;
}

interface IProps {
    question: Question[];
    meetName: string;
    answer?: Answer[];
    calls: (methodName: string, args: any[]) => void
}

const PersonalQuestions: React.FC<IProps> = (props) => {
    return (
        <></>
    )
}

export default PersonalQuestions;