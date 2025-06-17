export interface GroupNotification {
    id: number;
    messageTypeId: number;
    detail: string;
    groupId: number;
    messageType: MessageType;
}

export interface MessageType {
    id: number;
    name: string;
    
}