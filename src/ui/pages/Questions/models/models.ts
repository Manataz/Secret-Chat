export interface UserResponse {
    ResponseId: number;
    Answer: string;
    MeetQuestionId?: number;
}

export interface Question {
    id: number;
    title: string;
    expireDate: string;
}