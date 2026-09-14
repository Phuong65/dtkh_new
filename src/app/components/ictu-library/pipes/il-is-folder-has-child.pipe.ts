import { Pipe , PipeTransform } from '@angular/core';
import { IctuLibraryFolder } from '@components/ictu-library/ictu-library.component';

@Pipe( {
	name       : 'ilIsFolderHasChild' ,
	standalone : true
} )
export class IlIsFolderHasChildPipe implements PipeTransform {
	
	transform( tree : IctuLibraryFolder[] , menuID : number ) : boolean {
		return tree.some( ( childFolder : IctuLibraryFolder ) : boolean => childFolder.parent_id === menuID );
	}
	
}
