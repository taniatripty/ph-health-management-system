export interface ICreatePrescriptionPayload {
    appointmentId: string;
    followUpDate: Date;
    instructions: string;
}

export interface IUpdatePrescriptionPayload {
    followDate?: Date;
    instructions?: string;
}