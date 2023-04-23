export interface Queue {
    userType: "vip" | "normal",
    status:"pending" | "processing" | "completed",
    queueNo : number,
}

export interface QueueState {
    normalQueue : Queue[],
    vipQueue : Queue[],
    completedQueue : Queue[]
}

export interface Bot{
    handlingQueue: number,
    timeOutId:number,
}