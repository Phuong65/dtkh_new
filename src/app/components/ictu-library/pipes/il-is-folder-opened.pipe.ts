import { Pipe , PipeTransform } from '@angular/core';
import { IctuLibraryFolder } from '@components/ictu-library/ictu-library.component';

@Pipe( {
	name       : 'ilIsFolderOpened' ,
	standalone : true
} )
export class IlIsFolderOpenedPipe implements PipeTransform {
	
	transform( tree : IctuLibraryFolder[] , menuID : number ) : boolean {
		return tree.some( ( folder : IctuLibraryFolder ) : boolean => folder.id === menuID && folder.isOpened );
	}
	
}
