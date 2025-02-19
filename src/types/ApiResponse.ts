import { Message } from "@/model/User.model";

// type safety and response type declaration
// Api response data type
export interface ApiResponse {
    success: boolean;
    message: string; // message of the response
    isAcceptingMessages? : boolean // ? optional
    messages?: Array<Message> // Array of [message]
}