import { Pipe , PipeTransform } from '@angular/core';
import { IctuFile } from '@models/file';

@Pipe( {
	name : 'ilIsFileOwner'
} )
export class IlIsFileOwnerPipe implements PipeTransform {
	
	transform( item : Pick<IctuFile , 'user_id'> , userID : number ) : boolean {
		return item?.user_id === userID;
	}
	
}
