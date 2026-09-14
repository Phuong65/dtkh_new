import { Component , Inject , inject , OnDestroy , signal , WritableSignal } from '@angular/core';
import { IctuFileService } from '@services/ictu-file.service';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material/dialog';
import { AppState } from '@models/app-state';
import { Subject , takeUntil } from 'rxjs';
import { UploadInfo } from '@models/file';
import { FormatBytesPipe } from '@pipes/format-bytes.pipe';
import { MatButton } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressBar } from '@angular/material/progress-bar';
import { supportedExtensions } from '@components/ictu-library/pipes/il-file-type.pipe';
import { _3Gb } from '@utilities/syscats';

export interface LibraryUploadDialogData {
	folderId : number;
	donviId : number;
	userId : number;
}

interface UploadQueueItem {
	file : File;
	name : string;
	size : number;
	state : WritableSignal<'PENDING' | 'IN_PROGRESS' | 'DONE' | 'ERROR'>;
	progress : WritableSignal<number>;
	errorMessage? : string;
}

export function getFileExtension( fileName : string ) : string {
	if ( !fileName ) {
		return '';
	}
	
	const lastDotIndex : number = fileName.lastIndexOf( '.' );
	
	if ( lastDotIndex <= 0 || lastDotIndex === fileName.length - 1 ) {
		return '';
	}
	
	return fileName.substring( lastDotIndex + 1 ).toLowerCase();
}

@Component( {
	selector    : 'app-library-upload-dialog' ,
	imports     : [ FormatBytesPipe , MatButton , MatProgressBar ] ,
	templateUrl : './library-upload-dialog.component.html' ,
	styleUrl    : './library-upload-dialog.component.css'
} )
export class LibraryUploadDialogComponent implements OnDestroy {
	
	private fileService : IctuFileService                          = inject( IctuFileService );
	private dialogRef : MatDialogRef<LibraryUploadDialogComponent> = inject( MatDialogRef );
	
	uploadQueue : UploadQueueItem[]         = [];
	isDragging : boolean                    = false;
	overallState : WritableSignal<AppState> = signal<AppState>( 'success' );
	
	private destroyed$ : Subject<void> = new Subject<void>();
	
	private dirty : boolean = false;
	
	constructor( @Inject( MAT_DIALOG_DATA ) public data : LibraryUploadDialogData ) {}
	
	// ── Drag & Drop ──
	
	onDragOver( event : DragEvent ) : void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = true;
	}
	
	onDragLeave( event : DragEvent ) : void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = false;
	}
	
	onDrop( event : DragEvent ) : void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging        = false;
		const files : FileList = event.dataTransfer?.files;
		if ( files && files.length > 0 ) {
			this.processFiles( this.validateFiles( files ) );
		}
	}
	
	onFileSelected( event : Event ) : void {
		const input = event.target as HTMLInputElement;
		if ( input.files && input.files.length > 0 ) {
			this.processFiles( this.validateFiles( input.files ) );
		}
	}
	
	private validateFiles( fileList : FileList ) : UploadQueueItem[] {
		return Array.from( fileList ).reduce( ( reducer : UploadQueueItem[] , file : File ) : UploadQueueItem[] => {
			const fileExtension : string = getFileExtension( file.name );
			const item : UploadQueueItem = {
				file ,
				name     : file.name ,
				size     : file.size ,
				state    : signal( 'PENDING' ) ,
				progress : signal( 0 )
			};
			switch ( true ) {
				case !supportedExtensions.includes( fileExtension ):
					item.state.set( 'ERROR' );
					item.errorMessage = `Định dạng file không được hỗ trợ.`;
					break;
				case file.size > _3Gb:
					item.state.set( 'ERROR' );
					item.errorMessage = `Dung lượng file vượt quá giới hạn.`;
					break;
				default:
					break;
			}
			reducer.push( item );
			return reducer;
		} , [] );
	}
	
	private processFiles( items : UploadQueueItem[] ) : void {
		this.uploadQueue = items;
		this.overallState.set( 'loading' );
		this.uploadNext( 0 );
	}
	
	private uploadNext( index : number ) : void {
		if ( index >= this.uploadQueue.length ) {
			this.overallState.set( 'success' );
			return;
		}
		
		if ( this.uploadQueue[ index ].state() === 'PENDING' ) {
			const item : UploadQueueItem = this.uploadQueue[ index ];
			item.state.set( 'IN_PROGRESS' );
			
			this.fileService.uploadToLibrary( item.file , this.data.folderId ).pipe(
				takeUntil( this.destroyed$ )
			).subscribe( {
				next  : ( uploadInfo : UploadInfo ) : void => {
					item.progress.set( uploadInfo.progress );
					if ( uploadInfo.state === 'DONE' && uploadInfo.response ) {
						item.state.set( 'DONE' );
						this.uploadNext( index + 1 );
						this.dirty = true;
					}
				} ,
				error : ( errorResponse : HttpErrorResponse ) : void => {
					item.state.set( 'ERROR' );
					item.errorMessage = errorResponse?.error?.message || 'Tải lên thất bại';
					this.uploadNext( index + 1 );
				}
			} );
		} else {
			this.uploadNext( index + 1 );
		}
	}
	
	// ── Helpers ──
	
	isUploading() : boolean {
		return this.uploadQueue.some( item => item.state() === 'IN_PROGRESS' || item.state() === 'PENDING' );
	}
	
	getCompletedCount() : number {
		return this.uploadQueue.filter( item => item.state() === 'DONE' ).length;
	}
	
	getErrorCount() : number {
		return this.uploadQueue.filter( item => item.state() === 'ERROR' ).length;
	}
	
	close() : void {
		this.dialogRef.close( this.dirty );
	}
	
	cancel() : void {
		this.dialogRef.close( this.dirty );
	}
	
	ngOnDestroy() : void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
