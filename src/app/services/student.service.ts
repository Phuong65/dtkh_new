import { Injectable } from '@angular/core';
import { Student } from '@models/user';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';

@Injectable( {
    providedIn : 'root'
} )
export class StudentService extends IctuBaseServiceClass<Student> {

    constructor () {
        super( 'student' );
    }
}
