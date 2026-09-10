import { IctuBaseModel } from '@models/ictu-base-model';

export interface TrainingMode extends IctuBaseModel {
    id: number;
    code: string;
    name: string;
    description: string;
}