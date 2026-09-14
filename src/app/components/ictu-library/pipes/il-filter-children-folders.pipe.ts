import { Pipe , PipeTransform } from '@angular/core';
import { IctuLibraryFolder } from '@components/ictu-library/ictu-library.component';
import { filter } from 'lodash-es';

@Pipe( {
	name       : 'ilFilterChildrenFolders' ,
	standalone : true
} )
export class IlFilterChildrenFoldersPipe implements PipeTransform {
	
	transform( tree : IctuLibraryFolder[] , menuId : number ) : IctuLibraryFolder[] {
		return filter( tree , { parent_id : menuId } );
	}
	
}
