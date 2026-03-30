export interface EventCause {
    id: number;
    name : string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: string;
}

export interface EventCreator {
    id:number;
    name: string;
    email: string;

}
export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    location: string;
    eventDate: string;
    causeId: number;
    createdBy: number;
    isActive: boolean;
    createdAt: string;
    cause: EventCause;
    creator: EventCreator;

}