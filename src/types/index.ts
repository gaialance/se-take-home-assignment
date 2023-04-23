export interface Queue {
    queueNo : number,
    status:"pending" | "processing" | "completed",
    userType: "vip" | "normal",
}

export interface QueueState {
    normalQueue : Queue[],
    vipQueue : Queue[],
    completedQueue : Queue[]
}

export interface Bot{
    assignedQueue: Queue[],
    timeOutId:number,
    processTask: (delay:number,completedQueue:Queue[]) => void;
}