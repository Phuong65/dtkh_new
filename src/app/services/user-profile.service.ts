import { Injectable } from '@angular/core';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';
import { UserProfile } from '@models/user-profile';

@Injectable( {
    providedIn : 'root'
} )
export class UserProfileService extends IctuBaseServiceClass<UserProfile> {

    constructor () {
        super( 'user-profile' );
    }
}
