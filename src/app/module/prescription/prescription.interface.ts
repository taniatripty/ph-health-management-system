export interface ICreatePrescriptionPayload {
    appointmentId: string;
    followDate: Date;
    instructions: string;
}

export interface IUpdatePrescriptionPayload {
    followDate?: Date;
    instructions?: string;
}