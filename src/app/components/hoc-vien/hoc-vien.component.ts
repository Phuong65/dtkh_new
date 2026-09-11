import { CommonModule } from '@angular/common';
import { Component , inject , OnDestroy , OnInit , signal , Signal , viewChild , WritableSignal } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { forkJoin , map , Observable , of , Subject , switchMap , takeUntil } from 'rxjs';
import { UserProfile } from '@models/user-profile';
import { AdminUserPayload , UserService } from '@services/user.service';
import { UserProfileService } from '@services/user-profile.service';
import { AppState } from '@models/app-state';
import { DataTableEvent , DataTableEventName , IctuDataTable2 , IctuDataTablePaginatorInfo } from '@models/datatable';
import { DtoObject , IctuConditionParam , IctuQueryCondition , IctuQueryParams } from '@models/dto';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { NotificationService } from '@services/notification.service';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';

interface GenderOption {
    label : string;
    value : string;
}

@Component( {
    selector    : 'app-hoc-vien' ,
    standalone  : true ,
    imports     : [
        CommonModule ,
        FormsModule ,
        ReactiveFormsModule ,
        Drawer ,
        InputText ,
        Select ,
        MatButton ,
        MatCheckbox ,
        IctuPaginatorComponent ,
        LoadingProgressComponent
    ] ,
    templateUrl : './hoc-vien.component.html' ,
    styleUrl    : './hoc-vien.component.css'
} )
export class HocVienComponent implements OnInit , OnDestroy {

    private readonly fb : FormBuilder = inject( FormBuilder );

    private readonly userProfileService : UserProfileService = inject( UserProfileService );

    private readonly userService : UserService = inject( UserService );

    private readonly notification : NotificationService = inject( NotificationService );

    private readonly destroy$ : Subject<void> = new Subject<void>();

    private readonly eventObserver$ : Subject<DataTableEvent<UserProfile>> = new Subject<DataTableEvent<UserProfile>>();

    readonly state : WritableSignal<AppState> = signal<AppState>( 'loading' );

    readonly drawer : Signal<Drawer> = viewChild<Drawer>( 'pDrawer' );

    readonly dataTable : IctuDataTable2<UserProfile> = new IctuDataTable2<UserProfile>( {
        rows         : 20 ,
        pageLinkSize : 5
    } );

    readonly genderOptions : GenderOption[] = [
        { label : 'Nam' , value : 'nam' } ,
        { label : 'Nữ' , value : 'nu' } ,
        { label : 'Khác' , value : 'khac' }
    ];

    readonly statusOptions : Array<{ label : string , value : number }> = [
        { label : 'Hoạt động' , value : 1 } ,
        { label : 'Tạm khóa' , value : 0 }
    ];

    readonly formControl : IctuFormControl2<UserProfile> = new IctuFormControl2<UserProfile>( {
        dropdownFields : [] ,
        formGroup      : this.fb.group( {
            student_code : [ '' , [ Validators.required , Validators.maxLength( 50 ) ] ] ,
            full_name    : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 255 ) ] ] ,
            username     : [ '' , [ Validators.required , Validators.minLength( 3 ) , Validators.maxLength( 50 ) ] ] ,
            password     : [ '' , [ Validators.minLength( 6 ) ] ] ,
            birthday     : [ '' , [ Validators.maxLength( 20 ) ] ] ,
            gender       : [ 'nam' , Validators.required ] ,
            email        : [ '' , [ Validators.required , Validators.email , Validators.maxLength( 100 ) ] ] ,
            phone        : [ '' , [ Validators.maxLength( 20 ) ] ] ,
            address      : [ '' , [ Validators.maxLength( 255 ) ] ] ,
            status       : [ 1 , Validators.required ]
        } ) ,
        objectName : 'học viên' ,
        drawer     : this.drawer
    } );

    _search : string = '';

    private _temp : IctuDataTablePaginatorInfo = { paged : 1 , resetPaginator : true };

    private readonly handleEvent : Record<DataTableEventName , ( data : UserProfile ) => void> = {
        OPEN_FORM_ADD        : () : void => this.addForm() ,
        OPEN_FORM_UPDATE     : ( data : UserProfile ) : void => this.editForm( data ) ,
        DELETE_SINGLE_ROW    : ( data : UserProfile ) : void => this.deleteRow( data ) ,
        DELETE_SELECTED_ROWS : () : void => this.deleteSelectedRows() ,
        SUBMIT_FORM          : () : void => this.submitForm()
    };

    get f () : FormGroup {
        return this.formControl.formGroup;
    }

    constructor () {
        this.eventObserver$.pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( { name , data } : DataTableEvent<UserProfile> ) : void => this.handleEvent[ name ]( data ) );
    }

    ngOnInit () : void {
        this.loadData( 1 , true );
    }

    ngOnDestroy () : void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData ( paged : number = 1 , resetPaginator : boolean = true ) : void {
        this.state.set( 'loading' );
        this._temp = { paged , resetPaginator };
        const conditions : IctuConditionParam[] = [];
        const keyword : string = this._search.trim();

        if ( keyword ) {
            conditions.push( {
                conditionName : 'student_code' ,
                condition     : IctuQueryCondition.like ,
                value         : `%${ keyword }%`
            } );
        }

        const queryParams : IctuQueryParams = {
            paged ,
            limit   : this.dataTable.paginator.rows() ,
            orderby : 'id' ,
            order   : 'DESC'
        };

        this.userProfileService.query( conditions , queryParams ).pipe(
            switchMap( ( response : DtoObject<UserProfile[]> ) : Observable<{ response : DtoObject<UserProfile[]> , users : any[] }> => {
                const userIds : number[] = Array.from( new Set( ( response.data || [] ).map( ( item : UserProfile ) : number => item.user_id ).filter( ( id : number ) : boolean => !! id ) ) );
                if ( ! userIds.length ) {
                    return of( { response , users : [] } );
                }
                return this.userService.listByIds( userIds ).pipe(
                    map( ( users : any[] ) : { response : DtoObject<UserProfile[]> , users : any[] } => ( { response , users } ) )
                );
            } ) ,
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : ( { response , users } : { response : DtoObject<UserProfile[]> , users : any[] } ) : void => {
                const userMap : Map<number , any> = new Map( users.map( ( user : any ) : [ number , any ] => [ user.id , user ] ) );
                const data : UserProfile[] = ( response.data || [] ).map( ( item : UserProfile ) : UserProfile => {
                    const user : any = userMap.get( item.user_id );
                    return {
                        ...item ,
                        username    : user ? user.username : '—' ,
                        email       : item.email || ( user ? user.email : '' ) ,
                        phone       : item.phone || ( user ? user.phone : '' ) ,
                        user_status : user ? user.status : item.status ,
                        reGender    : this.genderOptions.find( ( gender : GenderOption ) : boolean => gender.value === ( item.gender || '' ).toLowerCase() )?.label || item.gender || '—'
                    };
                } );
                this.dataTable.fillRawData( { ...response , data } , { paged , resetPaginator } );
                this.state.set( 'success' );
            } ,
            error : () : void => {
                this.state.set( 'error' );
                this.notification.toastError( 'Không tải được danh sách học viên' );
            }
        } );
    }

    reload ( event? : Event ) : void {
        event?.preventDefault();
        this.loadData( 1 , true );
    }

    onSearchData () : void {
        this.loadData( 1 , true );
    }

    onChangePage ( paged : number ) : void {
        this.loadData( paged , false );
    }

    addNewItem () : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_ADD' , data : null } );
    }

    editRow ( row : UserProfile ) : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_UPDATE' , data : row } );
    }

    addForm () : void {
        this.f.reset( {
            student_code : '' ,
            full_name    : '' ,
            username     : '' ,
            password     : '' ,
            birthday     : '' ,
            gender       : 'nam' ,
            email        : '' ,
            phone        : '' ,
            address      : '' ,
            status       : 1
        } );
        this.f.controls[ 'password' ].setValidators( [ Validators.required , Validators.minLength( 6 ) ] );
        this.f.controls[ 'password' ].updateValueAndValidity();
        this.formControl.openFormAdd();
    }

    editForm ( row : UserProfile ) : void {
        this.f.reset( {
            student_code : row.student_code || '' ,
            full_name    : row.full_name || '' ,
            username     : row.username || '' ,
            password     : '' ,
            birthday     : row.birthday || '' ,
            gender       : ( row.gender || 'nam' ).toLowerCase() ,
            email        : row.email || '' ,
            phone        : row.phone || '' ,
            address      : row.address || '' ,
            status       : row.user_status ?? row.status ?? 1
        } );
        this.f.controls[ 'password' ].clearValidators();
        this.f.controls[ 'password' ].setValidators( [ Validators.minLength( 6 ) ] );
        this.f.controls[ 'password' ].updateValueAndValidity();
        this.formControl.openFormEdit( row );
    }

    toggleStatus ( row : UserProfile ) : void {
        const nextStatus : number = ( row.user_status ?? row.status ) === 1 ? 0 : 1;
        const requests : Observable<any>[] = [
            this.userProfileService.update( row.id , { status : nextStatus } )
        ];
        if ( row.user_id ) {
            requests.push( this.userService.updateForAdministration( row.user_id , { status : nextStatus } ) );
        }
        forkJoin( requests ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : () : void => {
                row.status = nextStatus;
                row.user_status = nextStatus;
                this.notification.toastSuccess( 'Cập nhật trạng thái thành công' );
            } ,
            error : () : void => this.notification.toastError( 'Không thể cập nhật trạng thái' )
        } );
    }

    deleteRow ( row : UserProfile ) : void {
        this.notification.confirmDelete( 1 ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( confirmed : boolean ) : void => {
            if ( ! confirmed ) {
                return;
            }
            const requests : Observable<any>[] = [
                this.userProfileService.delete( row.id )
            ];
            if ( row.user_id ) {
                requests.push( this.userService.deleteForAdministration( row.user_id ) );
            }
            forkJoin( requests ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( 'Xóa học viên thành công' );
                    this.loadData( this._temp.paged , false );
                } ,
                error : () : void => this.notification.toastError( 'Xóa học viên thất bại' )
            } );
        } );
    }

    deleteSelectedRows () : void {
        const selected : UserProfile[] = this.dataTable.getSelectedData();
        if ( ! selected.length ) {
            return;
        }
        this.notification.confirmDelete( selected.length ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( confirmed : boolean ) : void => {
            if ( ! confirmed ) {
                return;
            }
            const requests : Observable<any>[] = selected.flatMap( ( row : UserProfile ) : Observable<any>[] => {
                const arr : Observable<any>[] = [ this.userProfileService.delete( row.id ) ];
                if ( row.user_id ) {
                    arr.push( this.userService.deleteForAdministration( row.user_id ) );
                }
                return arr;
            } );
            forkJoin( requests ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( `Xóa thành công ${ selected.length } học viên` );
                    this.loadData( 1 , true );
                } ,
                error : () : void => this.notification.toastError( 'Xóa danh sách học viên thất bại' )
            } );
        } );
    }

    submitForm () : void {
        if ( this.f.invalid ) {
            this.f.markAllAsTouched();
            this.notification.toastWarning( 'Vui lòng kiểm tra lại thông tin' );
            return;
        }

        const value : any = this.f.getRawValue();
        const parts : string[] = ( value.full_name || '' ).trim().split( /\s+/ );
        const lastName : string = parts.length ? parts[ parts.length - 1 ] : '';

        const userPayload : Partial<AdminUserPayload> = {
            username     : value.username ,
            display_name : value.full_name ,
            email        : value.email ,
            phone        : value.phone ,
            status       : value.status
        };
        if ( value.password ) {
            userPayload.password = value.password;
        }

        const isFormAdd : boolean = this.formControl.isFormAdd;
        let operation$ : Observable<any>;

        if ( isFormAdd ) {
            operation$ = this.userService.createForAdministration( userPayload as AdminUserPayload ).pipe(
                switchMap( ( newUserId : number ) : Observable<number> => {
                    const profilePayload : Partial<UserProfile> = {
                        user_id      : newUserId ,
                        student_code : value.student_code ,
                        full_name    : value.full_name ,
                        name         : lastName ,
                        birthday     : value.birthday ,
                        gender       : value.gender ,
                        address      : value.address ,
                        email        : value.email ,
                        phone        : value.phone ,
                        status       : value.status
                    };
                    return this.userProfileService.create( profilePayload );
                } )
            );
        } else {
            const currentProfile : UserProfile = this.formControl.object;
            const profilePayload : Partial<UserProfile> = {
                student_code : value.student_code ,
                full_name    : value.full_name ,
                name         : lastName ,
                birthday     : value.birthday ,
                gender       : value.gender ,
                address      : value.address ,
                email        : value.email ,
                phone        : value.phone ,
                status       : value.status
            };
            const updateOps : Observable<any>[] = [
                this.userProfileService.update( currentProfile.id , profilePayload )
            ];
            if ( currentProfile.user_id ) {
                updateOps.push( this.userService.updateForAdministration( currentProfile.user_id , userPayload ) );
            }
            operation$ = forkJoin( updateOps );
        }

        this.formControl.submit( operation$ ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : () : void => {
                this.notification.toastSuccess( isFormAdd ? 'Thêm học viên thành công' : 'Cập nhật học viên thành công' );
                this.formControl.closeForm();
                this.loadData( this._temp.paged , isFormAdd );
            } ,
            error : () : void => this.notification.toastError( isFormAdd ? 'Thêm học viên thất bại' : 'Cập nhật học viên thất bại' )
        } );
    }
}
