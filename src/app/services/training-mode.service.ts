import { Injectable } from '@angular/core';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';
import { TrainingMode } from '@models/training-mode';

@Injectable( {
    providedIn : 'root'
} )
export class TrainingModeService extends IctuBaseServiceClass<TrainingMode> {

    constructor () {
        super( 'training-modes' );
    }
}