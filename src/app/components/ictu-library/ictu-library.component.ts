import { Component , computed , inject , input , InputSignal , OnDestroy , OnInit , Signal , signal , WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError , debounceTime , filter , forkJoin , map , Observable , of , Subject , switchMap , takeUntil , tap } from 'rxjs';
import { FormControl , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialog , MatDialogRef } from '@angular/material/dialog';
import { v4 as uuid4 } from 'uuid';
import { AppState } from '@models/app-state';
import { DtoObject , IctuConditionParam , IctuQueryCondition , IctuQueryParams } from '@models/dto';
import { NotificationService } from '@services/notification.service';
import { IctuFileService } from '@services/ictu-file.service';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { FormatBytesPipe } from '@pipes/format-bytes.pipe';
import { InputText } from 'primeng/inputtext';
import { NgScrollbar } from 'ngx-scrollbar';
import { takeUntilDestroyed , toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs/operators';
import { IctuBasicFile , IctuFile , IctuFolder } from '@models/file';
import { LibraryFolderTreeComponent } from '@components/ictu-library/components/library-folder-tree/library-folder-tree.component';
import { map as _map , find as _find , cloneDeep } from 'lodash-es';
import dayjs from '@setup/dayjs';
import { Dialog } from 'primeng/dialog';
import { FormGroupType } from '@models/common';
import { MatButton } from '@angular/material/button';
import { LibraryUploadDialogComponent } from '@components/ictu-library/components/library-upload-dialog/library-upload-dialog.component';
import { IlFileTypePipe } from '@components/ictu-library/pipes/il-file-type.pipe';
import { ConfirmDelete2Data } from '@theme/components/confirm-delete-2/confirm-delete-2.component';
import { IlIsFileOwnerPipe } from '@components/ictu-library/pipes/il-is-file-owner.pipe';
import { MatContextMenuTrigger , MatMenu , MatMenuContent , MatMenuItem } from '@angular/material/menu';
import { Select } from 'primeng/select';
import { IctuDropdownOption2 } from '@models/ictu-dropdown-option';
import { formatMenuName , sortMenus } from '@utilities/helper';
interface Breadcrumb {
	id : number;
	name : string;
}
type IctuLibraryFileEventName = 'download' | 'preview' | 'delete' | 'changeParentFolder';
interface IctuLibraryFileEvent {
	name : IctuLibraryFileEventName;
	file : IctuBasicFile;
	session : number;
}
export interface IctuLibraryFolder extends Pick<IctuFile , 'id' | 'parent_id' | 'name' | 'title' | 'type' | 'user_id' | 'ext' | 'share'> {
	isOpened : boolean;
	depth : number;
}
function calculateDepth( menu : IctuLibraryFolder , menuMap : Map<number , IctuLibraryFolder> , visited = new Set<number>() ) : number {
	
	if ( menu.depth >= 0 ) {
		return menu.depth;
	}
	
	if ( visited.has( menu.id ) ) {
		throw new Error( `Circular reference detected at menu ${ menu.id }` );
	}
	
	visited.add( menu.id );
	
	if ( menu.parent_id === 0 ) {
		menu.depth = 0;
		return 0;
	}
	
	const parent : IctuLibraryFolder = menuMap.get( menu.parent_id );
	
	if ( !parent ) {
		throw new Error( `Parent menu ${ menu.parent_id } not found` );
	}
	
	menu.depth = calculateDepth( parent , menuMap , visited ) + 1;
	
	visited.delete( menu.id );
	
	return menu.depth;
}
type FormCreateFolderFields = Pick<IctuFile , 'name' | 'title' | 'user_id' | 'parent_id' | 'type'>;
type FormEventName = 'renameFile' | 'renameFolder' | 'createFolder';
interface FormEvent {
	name : FormEventName,
	object : Pick<IctuFile , 'id' | 'parent_id' | 'name' | 'title' | 'type' | 'user_id' | 'ext'>,
	session : number
}
interface FormInfo {
	title : string,
	icon : string,
	buttonLabel : string,
	placeholder : string,
}
const FROM_INFO : Record<FormEventName , FormInfo> = {
	createFolder : { title : 'Tạo thư mục mới' , icon : 'fa-folder' , placeholder : 'Tên thư mục' , buttonLabel : 'Tạo thư mục' } ,
	renameFolder : { title : 'Đổi tên thư mục' , icon : 'fa-folder' , placeholder : 'Tên thư mục' , buttonLabel : 'Lưu lại' } ,
	renameFile   : { title : 'Đổi tên tệp tin' , icon : 'fa-file-edit' , placeholder : 'Tên tệp tin' , buttonLabel : 'Lưu lại' }
};
type IctuLibraryView = 'FolderTree' | 'FolderContent';
type IctuLibraryState = AppState | 'undefined' | 'createPersonalStoragePartition';
function removeExtension( fileName : string ) : string {
	const index : number = fileName.lastIndexOf( '.' );
	
	if ( index <= 0 ) {
		return fileName;
	}
	
	return fileName.substring( 0 , index );
}
type IctuLibraryDeleteResponse = 'cancel' | 'deleted' | 'deleteFail' | 'folderFull';
@Component( {
	selector    : 'app-ictu-library' ,
	standalone  : true ,
	imports     : [ CommonModule , FormsModule , RouterModule , MatInputModule , LoadingProgressComponent , InputText , MatTooltip , FormatBytesPipe , NgScrollbar , LibraryFolderTreeComponent , Dialog , ReactiveFormsModule , MatButton , IlFileTypePipe , IlIsFileOwnerPipe , MatMenu , MatMenuContent , MatMenuItem , MatContextMenuTrigger , Select ] ,
	templateUrl : './ictu-library.component.html' ,
	styleUrl    : './ictu-library.component.css'
} )
export class IctuLibraryComponent implements OnInit , OnDestroy {
	
	userId : InputSignal<number> = input.required();
	
	donviId : InputSignal<number> = input.required();
	
	private fileService : IctuFileService = inject( IctuFileService );
	
	private notification : NotificationService = inject( NotificationService );
	private dialog : MatDialog = inject( MatDialog );
	
	readonly depth : number = 4; // Cấp độ được phép tạo thư mục p0/p1/p2/p3/p4;
	
	state : WritableSignal<IctuLibraryState> = signal<AppState>( 'loading' );
	
	search : WritableSignal<string> = signal( '' );
	
	private destroyed$ : Subject<void> = new Subject<void>();
	
	protected folders : WritableSignal<IctuLibraryFolder[]> = signal( [] );
	
	protected activeFolder : WritableSignal<IctuLibraryFolder> = signal( null );
	
	private readonly activeFolderId : Signal<number> = computed( () : number => this.activeFolder()?.id || 0 );
	
	private readonly session : WritableSignal<number> = signal( 0 );
	
	private readonly createPersonalStoragePartitionObserver : Subject<number> = new Subject<number>();
	
	protected enableFormFolderDialog : boolean = false;
	
	protected enableFormUpdateParentFileDialog : boolean = false;
	
	protected newFileParentId : number = 0;
	
	protected readonly formGroup : FormGroupType<FormCreateFolderFields> = new FormGroup( {
		name      : new FormControl<string>( '' ) ,
		title     : new FormControl<string>( '' , [ Validators.required , Validators.maxLength( 500 ) , Validators.minLength( 1 ) ] ) ,
		parent_id : new FormControl<number>( 0 ) ,
		user_id   : new FormControl<number>( 0 ) ,
		type      : new FormControl<string>( 'folder' )
	} );
	
	private readonly openFormObserver : Subject<FormEvent> = new Subject<FormEvent>();
	
	private readonly saveFormObserver : Subject<number> = new Subject<number>();
	
	private readonly formEvent : WritableSignal<FormEvent> = signal( null );
	
	readonly formInfo : Signal<FormInfo> = computed( () : FormInfo => {
		return FROM_INFO[ this.formEvent()?.name || 'createFolder' ];
	} );
	
	// ── Sự kiện formLoading : sử dụng chung cho cả 2 form ──
	readonly formLoading : WritableSignal<boolean> = signal( false );
	
	readonly breadcrumb : Signal<Breadcrumb[]> = computed( () : Breadcrumb[] => {
		if ( !this.activeFolder() ) {
			return [];
		}
		const breadcrumb : Breadcrumb[] = [];
		const chain : Breadcrumb[]      = [];
		let currentId : number          = this.activeFolder().id;
		while ( currentId !== 0 ) {
			const folder : IctuLibraryFolder = _find( this.folders() , { id : currentId } );
			if ( folder ) {
				chain.unshift( { id : folder.id , name : folder.title } );
				currentId = folder.parent_id;
			} else {
				break;
			}
		}
		breadcrumb.push( ... chain );
		return breadcrumb;
	} );
	
	readonly files : WritableSignal<IctuFile[]> = signal( [] );
	
	private processFileEventObserver$ : Subject<IctuLibraryFileEvent> = new Subject<IctuLibraryFileEvent>();
	
	private updateFileParentIdObserver$ : Subject<number> = new Subject<number>();
	
	readonly selectedItem : WritableSignal<IctuFile> = signal( null );
	
	readonly selectedItemId : Signal<number> = computed( () : number => this.selectedItem()?.id || 0 );
	
	readonly selectFolders : WritableSignal<IctuDropdownOption2<IctuLibraryFolder , number>[]> = signal( [] );
	
	constructor() {
		this.createPersonalStoragePartitionObserver.asObservable().pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged()
		).subscribe( () : void => {
			this.startCreatingPersonalStoragePartition();
		} );
		
		this.openFormObserver.asObservable().pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged( ( previous : FormEvent , current : FormEvent ) : boolean => previous?.session === current.session )
		).subscribe( ( event : FormEvent ) : void => {
			this.prepareFormFolder( event );
		} );
		
		this.saveFormObserver.asObservable().pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged()
		).subscribe( () : void => {
			this.saveFormFolder();
		} );
		
		toObservable( this.activeFolder ).pipe(
			takeUntilDestroyed() ,
			filter( Boolean )
		).subscribe( () : void => {
			this.search.set( '' );
			this.load( 'FolderContent' );
		} );
		
		this.processFileEventObserver$.pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged( ( previous : IctuLibraryFileEvent , current : IctuLibraryFileEvent ) : boolean => previous?.session === current.session ) ,
			debounceTime( 100 )
		).subscribe( ( event : IctuLibraryFileEvent ) : void => {
			this.processFileEvent( event );
		} );
		
		this.updateFileParentIdObserver$.asObservable().pipe(
			takeUntilDestroyed() ,
			distinctUntilChanged() ,
			debounceTime( 100 )
		).subscribe( () : void => {
			this.callUpdateCurrentItemParent();
		} );
	}
	
	ngOnInit() : void {
		this.load( 'FolderTree' );
	}
	
	protected getControl<K extends keyof FormCreateFolderFields>( key : K ) : FormControl<FormCreateFolderFields[K]> {
		return this.formGroup.get( key as string ) as FormControl<FormCreateFolderFields[K]>;
	}
	
	private setFolders( libraryFolder : IctuLibraryFolder[] ) : void {
		const libraryFolderMap : Map<number , IctuLibraryFolder> = libraryFolder.reduce( ( reducer : Map<number , IctuLibraryFolder> , _folder : IctuLibraryFolder ) : Map<number , IctuLibraryFolder> => {
			reducer.set( _folder.id , _folder );
			return reducer;
		} , new Map<number , IctuLibraryFolder> );
		this.folders.set( _map<IctuLibraryFolder , IctuLibraryFolder>( libraryFolder , ( _iFolder : IctuLibraryFolder ) : IctuLibraryFolder => ( { ... _iFolder , depth : calculateDepth( _iFolder , libraryFolderMap ) } ) ) );
		if ( !this.activeFolder() ) {
			const rootFolder : IctuLibraryFolder = _find( this.folders() , { parent_id : 0 } );
			if ( rootFolder ) {
				this.openFolder( rootFolder.id );
			}
		}
		this.state.set( 'success' );
	}
	
	private load( ... views : IctuLibraryView[] ) : void {
		this.state.set( 'loading' );
		const requests : Observable<IctuLibraryState>[] = [];
		if ( views.includes( 'FolderTree' ) ) {
			requests.push( this._loadFolderTree() );
		}
		if ( views.includes( 'FolderContent' ) ) {
			requests.push( this._loadFolderContent() );
		}
		
		forkJoin( requests ).pipe(
			takeUntil( this.destroyed$ )
		).subscribe( {
			next  : ( states : IctuLibraryState[] ) : void => {
				this.increaseSession();
				this.state.set( states.every( ( s : IctuLibraryState ) : boolean => s === 'success' ) ? 'success' : 'undefined' );
			} ,
			error : (e) : void => {
				console.error('Error loading library data', e);
				this.increaseSession();
				this.state.set( 'error' );
			}
		} );
	}
	
	private _loadFolderTree() : Observable<IctuLibraryState> {
		const queryParams : IctuQueryParams = {
			select  : 'id,parent_id,name,title,type,user_id,ext,share' ,
			orderby : 'title' ,
			order   : 'ASC'
		};
		return this.fileService.loadFolders( queryParams ).pipe(
			tap( ( folders : IctuFolder[] ) : void => {
				const libraryFolder : IctuLibraryFolder[] = _map<IctuFolder , IctuLibraryFolder>( folders , ( { id , parent_id , name , title , type , user_id , share } : IctuFolder ) : IctuLibraryFolder => {
					const index : number = this.folders().findIndex( ( _item : IctuLibraryFolder ) : boolean => _item.id === id );
					return {
						id , parent_id , name , title , type , user_id ,
						isOpened : -1 === index ? false : this.folders()[ index ].isOpened ,
						depth    : -1 ,
						ext      : '' ,
						share
					};
				} );
				this.setFolders( libraryFolder );
			} ) ,
			map( ( folders : IctuFolder[] ) : IctuLibraryState => folders.length ? 'success' : 'undefined' )
		);
	}
	
	private _loadFolderContent() : Observable<IctuLibraryState> {
		const queryParams : IctuQueryParams     = {
			limit   : -1 ,
			paged   : 1 ,
			orderby : 'title' ,
			order   : 'ASC'
		};
		const conditions : IctuConditionParam[] = [
			{ conditionName : 'parent_id' , condition : IctuQueryCondition.equal , value : this.activeFolderId().toString( 10 ) }
		];
		
		if ( this.search() ) {
			conditions.push(
				{ conditionName : 'title' , condition : IctuQueryCondition.like , value : `%${ this.search() }%` , orWhere : 'and' }
			);
		}
		
		return this.fileService.query( conditions , queryParams ).pipe(
			tap( ( response : DtoObject<IctuFile[]> ) : void => {
				this.files.set( response.data );
			} ) ,
			map( () : IctuLibraryState => 'success' )
		);
	}
	
	protected openFolder( folderId : number | null ) : void {
		if ( !this.activeFolder() || this.activeFolder().id !== folderId ) {
			this.activeFolder.set( _find( this.folders() , { id : folderId } ) );
		}
	}
	
	protected onSearchData() : void {
		this.load( 'FolderContent' );
	}
	
	protected openCreateFolderDialog() : void {
		this.openFormObserver.next( {
			name    : 'createFolder' ,
			object  : this.activeFolder() ,
			session : this.session()
		} );
	}
	
	private prepareFormFolder( event : FormEvent ) : void {
		this.formEvent.set( event );
		switch ( event.name ) {
			case 'createFolder':
				this.formGroup.reset( {
					name      : uuid4() ,
					title     : '' ,
					parent_id : event.object.id ,
					user_id   : event.object.user_id ,
					type      : 'folder'
				} );
				break;
			default :
				this.formGroup.reset( {
					name      : event.object.name ,
					title     : event.name === 'renameFolder' ? event.object.title : removeExtension( event.object.title ) ,
					parent_id : event.object.id ,
					user_id   : event.object.user_id ,
					type      : event.object.type
				} );
				break;
		}
		this.formLoading.set( false );
		this.enableFormFolderDialog = true;
	}
	
	private saveFormFolder() : void {
		let info : Partial<IctuFile> = this.formGroup.getRawValue();
		let request : Observable<number>;
		switch ( this.formEvent().name ) {
			case 'createFolder':
				request = this.folderCreator( info ).pipe(
					tap( () : void => this.load( 'FolderTree' , 'FolderContent' ) )
				);
				break;
			default :
				const title : string = this.getControl( 'type' ).value === 'folder' || !this.formEvent().object.ext ? this.getControl( 'title' ).value : [ this.getControl( 'title' ).value , this.formEvent().object.ext.toLowerCase() ].join( '.' );
				request              = this.fileService.updateFileInfo( this.formEvent().object.id.toString( 10 ) , { title } ).pipe(
					tap( () : void => {
						if ( this.getControl( 'type' ).value === 'folder' ) {
							this.load( 'FolderTree' , 'FolderContent' );
						} else {
							this.load( 'FolderContent' );
						}
					} )
				);
				break;
		}
		request.subscribe( {
			next  : () : void => {
				this.formLoading.set( false );
				this.hideDialog();
			} ,
			error : () : void => {
				this.formLoading.set( false );
				this.increaseSession();
			}
		} );
	}
	
	protected btnSaveFormFolder() : void {
		if ( this.formGroup.valid ) {
			this.formLoading.set( true );
			this.saveFormObserver.next( this.session() );
		}
	}
	
	protected onHideDialog() : void {
		this.increaseSession();
	}
	
	// ── Sự kiện hideDialog : sử dụng chung cho cả 2 form ──
	
	protected hideDialog() : void {
		this.enableFormFolderDialog           = false;
		this.enableFormUpdateParentFileDialog = false;
		this.selectedItem.set( null );
	}
	
	protected deleteItem( item : IctuFile ) : void {
		if ( item.user_id !== this.userId() ) {
			return;
		}
		this.selectedItem.set( item );
		this.processFileEventObserver$.next( {
			name    : 'delete' ,
			file    : { ... item , url : '' , location : 'aws' } ,
			session : this.session()
		} );
	}
	
	protected changeParentFolder( item : IctuFile ) : void {
		if ( item.user_id !== this.userId() ) {
			return;
		}
		this.selectedItem.set( item );
		this.processFileEventObserver$.next( {
			name    : 'changeParentFolder' ,
			file    : { ... item , url : '' , location : 'aws' } ,
			session : this.session()
		} );
	}
	
	protected renameItem( item : IctuFile ) : void {
		if ( item.user_id !== this.userId() ) {
			return;
		}
		this.openFormObserver.next( {
			name    : item.type === 'folder' ? 'renameFolder' : 'renameFile' ,
			object  : item ,
			session : this.session()
		} );
	}
	
	protected downloadFile( item : IctuFile ) : void {
		this.selectedItem.set( item );
		this.processFileEventObserver$.next( {
			name    : 'download' ,
			file    : { ... item , url : '' , location : 'aws' } ,
			session : this.session()
		} );
	}
	
	protected previewFile( item : IctuFile ) : void {
		this.selectedItem.set( item );
		this.processFileEventObserver$.next( {
			name    : 'preview' ,
			file    : { ... item , url : '' , location : 'aws' } ,
			session : this.session()
		} );
	}
	
	private processFileEvent( { file , name } : IctuLibraryFileEvent ) : void {
		let request$ : Observable<any>;
		switch ( name ) {
			case 'delete':
				const _alias : string                      = file.type === 'folder' ? 'thư mục' : 'tệp tin';
				const config : Partial<ConfirmDelete2Data> = {
					heading     : `Xác nhận xóa ${ _alias }` ,
					htmlMessage : `<p class="m-0 f-roboto f-14 lh-base text-justify">Bạn có chắc chắn muốn xóa ${ _alias } <i class="text-primary">${ file.title }</i> không?</p>`
				};
				request$                                   = this.notification.confirmDelete2( config ).pipe(
					switchMap( ( confirm : boolean ) : Observable<IctuLibraryDeleteResponse> => confirm ? this._precheckDeleteItem( file ) : of( 'cancel' ) ) ,
					catchError( () : IctuLibraryDeleteResponse => 'deleteFail' ) ,
					tap( ( result : IctuLibraryDeleteResponse ) : void => {
						switch ( result ) {
							case 'deleted':
								if ( file.type === 'folder' ) {
									this.load( 'FolderTree' , 'FolderContent' );
								} else {
									this.load( 'FolderContent' );
								}
								this.notification.toastSuccess( `Xóa ${ _alias } thành công` );
								break;
							case 'deleteFail':
								this.notification.toastError( `Xóa ${ _alias } thất bại` );
								break;
							case 'folderFull':
								this.notification.toastWarning( 'Bạn chỉ có thể xoá những thư mục rỗng!' );
								break;
							default :
								break;
						}
					} )
				);
				break;
			case 'download':
				request$ = this.notification.downloadFile( file );
				break;
			case 'preview':
				request$ = this.notification.previewFile( { info : [ file ] } );
				break;
			case 'changeParentFolder':
				this.newFileParentId                = 0;
				const folders : IctuLibraryFolder[] = cloneDeep( this.folders() );
				this.selectFolders.set( _map<IctuLibraryFolder , IctuDropdownOption2<IctuLibraryFolder , number>>( sortMenus( folders ) , ( raw : IctuLibraryFolder ) : IctuDropdownOption2<IctuLibraryFolder , number> => ( { raw , value : raw.id , label : formatMenuName( raw.title , raw.depth ) , disabled : raw.id === this.selectedItem().parent_id } ) ) );
				this.formLoading.set( false );
				this.enableFormUpdateParentFileDialog = true;
				break;
			default :
				break;
		}
		if ( request$ ) {
			request$.pipe(
				takeUntil( this.destroyed$ )
			).subscribe( {
				next  : () : void => {
					this.increaseSession();
					this.selectedItem.set( null );
				} ,
				error : () : void => {
					this.increaseSession();
					this.selectedItem.set( null );
				}
			} );
		}
	}
	
	private _precheckDeleteItem( file : IctuBasicFile ) : Observable<IctuLibraryDeleteResponse> {
		const prepare$ : Observable<boolean> = file.type === 'folder' ? this._isFolderEmpty( file.id ) : of( true );
		return prepare$.pipe(
			switchMap( ( ready : boolean ) : Observable<IctuLibraryDeleteResponse> => ready ? this._callDeleteItem( file ) : of( 'folderFull' ) )
		);
	}
	
	private _callDeleteItem( file : IctuBasicFile ) : Observable<IctuLibraryDeleteResponse> {
		return this.fileService.deleteAwsItemByID( file.id ).pipe(
			map( () : IctuLibraryDeleteResponse => 'deleted' )
		);
	}
	
	private _isFolderEmpty( folderID : number ) : Observable<boolean> {
		const queryParams : IctuQueryParams     = {
			limit  : 1 ,
			paged  : 1 ,
			select : 'id,parent_id'
		};
		const conditions : IctuConditionParam[] = [
			{ conditionName : 'parent_id' , condition : IctuQueryCondition.equal , value : folderID.toString( 10 ) }
		];
		return this.fileService.query( conditions , queryParams ).pipe(
			map( ( response : DtoObject<IctuFile[]> ) : boolean => response.data.length === 0 )
		);
	}
	
	protected openUploadDialog() : void {
		const dialogRef : MatDialogRef<LibraryUploadDialogComponent , boolean> = this.dialog.open( LibraryUploadDialogComponent , {
			width        : '600px' ,
			disableClose : true ,
			data         : {
				folderId : this.activeFolderId() ,
				donviId  : this.donviId ,
				userId   : this.userId
			}
		} );
		
		dialogRef.afterClosed().pipe(
			takeUntil( this.destroyed$ )
		).subscribe( {
			next : ( dirty : boolean ) : void => {
				if ( dirty ) {
					this.load( 'FolderContent' );
				}
			}
		} );
	}
	
	protected reload( event : MouseEvent ) : void {
		event.preventDefault();
		event.stopPropagation();
		this.activeFolder.set( null );
		this.load( 'FolderTree' );
	}
	protected btnCreatePersonalStoragePartition() : void {
		this.state.set( 'createPersonalStoragePartition' );
		this.createPersonalStoragePartitionObserver.next( this.session() );
	}
	
	private startCreatingPersonalStoragePartition() : void {
		this.checkIsPersonalStoragePartitionCreated().pipe(
			takeUntil( this.destroyed$ ) ,
			switchMap( ( created : boolean ) : Observable<number> => created ? of( 1 ) : this.createNewPersonalStoragePartition() )
		).subscribe( {
			next  : () : void => {
				this.notification.toastSuccess( 'Khởi tạo không gian lưu trữ cá nhân thành công.' );
				this.load( 'FolderTree' );
			} ,
			error : () : void => {
				this.state.set( 'undefined' );
				this.notification.toastError( 'Khởi tạo không gian lưu trữ cá nhân thất bại.' );
				this.increaseSession();
			}
		} );
	}
	
	private checkIsPersonalStoragePartitionCreated() : Observable<boolean> {
		return this.fileService.getRootFolder().pipe(
			map( ( folder : IctuFolder ) : boolean => !!folder )
		);
	}
	
	private createNewPersonalStoragePartition() : Observable<number> {
		const info : Partial<IctuFolder> = {
			name      : uuid4() ,
			title     : 'Workspace' ,
			parent_id : 0 ,
			public    : 0 ,
			type      : 'folder' ,
			user_id   : this.userId() ,
			url       : dayjs( new Date() ).format( 'YYYY/MM' )
		};
		return this.folderCreator( info );
	}
	
	private folderCreator( info : Partial<IctuFile> ) : Observable<number> {
		return this.fileService.createFolder( info );
	}
	
	private increaseSession() : void {
		this.session.update( ( oldSessionNumber : number ) : number => 1 + oldSessionNumber );
	}
	
	// protected btnContentEvent( item : IctuLibraryFolder , name : LibraryFolderTreeMenuContextEventName ) : void {
	// 	this.menuContextEventObserver.next( { item , name , session : this.session() } );
	// }
	
	protected btnUpdateFileParent() : void {
		this.updateFileParentIdObserver$.next( this.session() );
		this.formLoading.set( true );
	}
	
	private callUpdateCurrentItemParent() : void {
		this.fileService.updateFileInfo( this.selectedItem().id.toString( 10 ) , { parent_id : this.newFileParentId } ).pipe(
			takeUntil( this.destroyed$ )
		).subscribe( {
			next  : () : void => {
				this.increaseSession();
				this.formLoading.set( false );
				this.hideDialog();
				this.load( 'FolderContent' );
				this.notification.toastSuccess( 'Chuyển đổi thư mục thành công.' );
			} ,
			error : () : void => {
				this.formLoading.set( false );
				this.increaseSession();
				this.notification.toastError( 'Chuyển đổi thư mục thất bại.' );
			}
		} );
	}
	
	ngOnDestroy() : void {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
