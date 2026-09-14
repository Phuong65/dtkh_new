import { Pipe , PipeTransform } from '@angular/core';
import { IctuLibraryFolder } from '@components/ictu-library/ictu-library.component';
import { filter as _filter } from 'lodash-es';

@Pipe( {
	name       : 'ilFilterRootFolder' ,
	standalone : true
} )
export class IlFilterRootFolderPipe implements PipeTransform {
	
	transform( folders : IctuLibraryFolder[] ) : IctuLibraryFolder[] {
		return _filter( folders , { depth : 0 } );
	}
}
