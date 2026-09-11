import { Injectable } from '@angular/core';
import { ClassManagement } from '@models/class-management';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';

@Injectable( {
    providedIn : 'root'
} )
export class ClassManagementService extends IctuBaseServiceClass<ClassManagement> {

    constructor () {
        super( 'class-management' );
    }
}
