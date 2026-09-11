import { CommonModule } from '@angular/common';
import { Component , inject , OnDestroy , OnInit , signal , Signal , viewChild , WritableSignal } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { AppState } from '@models/app-state';
import { IctuPermissionControl } from '@models/ictu-base-model';
import { DataTableEvent , DataTableEventName , IctuDataTable2 , IctuDataTablePaginatorInfo } from '@models/datatable';
import { AuthenticationService } from '@services/authentication.service';
import { DtoObject , IctuConditionParam , IctuQueryCondition , IctuQueryParams } from '@models/dto';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { TrainingMode } from '@models/training-mode';
import { NotificationService } from '@services/notification.service';
import { TrainingModeService } from '@services/training-mode.service';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { forkJoin , Observable , Subject , takeUntil } from 'rxjs';

@Component( {
    selector    : 'app-training-mode' ,
    imports     : [
        CommonModule ,
        FormsModule ,
        ReactiveFormsModule ,
        Drawer ,
        InputText ,
        Textarea ,
        MatButton ,
        MatCheckbox ,
        IctuPaginatorComponent ,
        LoadingProgressComponent
    ] ,
    templateUrl : './training-mode.component.html' ,
    styleUrl    : './training-mode.component.css' ,
    standalone  : true
} )
export class TrainingModeComponent implements OnInit , OnDestroy {

    private readonly fb : FormBuilder = inject( FormBuilder );

    private readonly trainingModeService : TrainingModeService = inject( TrainingModeService );

    private readonly notification : NotificationService = inject( NotificationService );

    private readonly authenticationService : AuthenticationService = inject( AuthenticationService );

    readonly permissionControl : IctuPermissionControl = new IctuPermissionControl( this.authenticationService.getUserPermission( 'hinh-thuc-dao-tao' ) );

    private readonly destroy$ : Subject<void> = new Subject<void>();

    private readonly eventObserver$ : Subject<DataTableEvent<TrainingMode>> = new Subject<DataTableEvent<TrainingMode>>();

    readonly state : WritableSignal<AppState> = signal<AppState>( 'loading' );

    readonly drawer : Signal<Drawer> = viewChild<Drawer>( 'pDrawer' );

    readonly dataTable : IctuDataTable2<TrainingMode> = new IctuDataTable2<TrainingMode>( {
        rows         : 20 ,
        pageLinkSize : 5
    } );

    readonly formControl : IctuFormControl2<TrainingMode> = new IctuFormControl2<TrainingMode>( {
        dropdownFields : [] ,
        formGroup      : this.fb.group( {
            name        : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 255 ) ] ] ,
            code        : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 50 ) ] ] ,
            description : [ '' ]
        } ) ,
        objectName     : 'hình thức đào tạo' ,
        drawer         : this.drawer
    } );

    _search : string = '';

    private _temp : IctuDataTablePaginatorInfo = { paged : 1 , resetPaginator : true };

    private readonly handleEvent : Record<DataTableEventName , ( data : TrainingMode ) => void> = {
        OPEN_FORM_ADD        : () : void => {
            if ( !this.permissionControl.canCreate ) {
                this.notification.toastWarning( 'Bạn không có quyền thêm hình thức đào tạo' );
                return;
            }
            this.f.reset( {
                name        : '' ,
                code        : '' ,
                description : ''
            } );
            this.formControl.openFormAdd();
        } ,
        OPEN_FORM_UPDATE     : ( data : TrainingMode ) : void => {
            if ( !this.permissionControl.canUpdate ) {
                this.notification.toastWarning( 'Bạn không có quyền sửa hình thức đào tạo' );
                return;
            }
            this.f.reset( {
                name        : data.name ,
                code        : data.code ,
                description : data.description || ''
            } );
            this.formControl.openFormEdit( data );
        } ,
        DELETE_SINGLE_ROW    : ( data : TrainingMode ) : void => {
            if ( !this.permissionControl.canDelete ) {
                this.notification.toastWarning( 'Bạn không có quyền xóa hình thức đào tạo' );
                return;
            }
            this.deleteRow( data );
        } ,
        DELETE_SELECTED_ROWS : () : void => {
            if ( !this.permissionControl.canDelete ) {
                this.notification.toastWarning( 'Bạn không có quyền xóa hình thức đào tạo' );
                return;
            }
            this.deleteSelectedRows();
        } ,
        SUBMIT_FORM          : () : void => {
            this.submitForm();
        }
    };

    get f () : FormGroup {
        return this.formControl.formGroup;
    }

    constructor () {
        this.eventObserver$.asObservable().pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( { name , data } : DataTableEvent<TrainingMode> ) : void => this.handleEvent[ name ]( data ) );
    }

    ngOnInit () : void {
        this.loadData( 1 , true );
    }

    ngOnDestroy () : void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData ( paged : number = 1 , resetPaginator : boolean = true ) : void {
        if ( !this.permissionControl.canView ) {
            this.state.set( 'success' );
            return;
        }
        this.state.set( 'loading' );
        this._temp = { paged , resetPaginator };

        const queryParams : IctuQueryParams = {
            paged ,
            limit   : this.dataTable.paginator.rows() ,
            orderby : 'name' ,
            order   : 'ASC'
        };
        const conditions : IctuConditionParam[] = [];

        if ( this._search.trim() ) {
            conditions.push( {
                conditionName : 'name' ,
                condition     : IctuQueryCondition.like ,
                value         : `%${ this._search.trim() }%`
            } );
        }

        this.trainingModeService.query( conditions , queryParams ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : ( response : DtoObject<TrainingMode[]> ) : void => {
                this.dataTable.fillRawData( response , { paged , resetPaginator } );
                this.state.set( 'success' );
            } ,
            error : () : void => {
                this.state.set( 'error' );
                this.notification.toastError( 'Không tải được danh sách hình thức đào tạo' );
            }
        } );
    }

    reload ( event? : Event ) : void {
        if ( event ) {
            event.preventDefault();
        }
        this.loadData( 1 , true );
    }

    onSearchData () : void {
        this.loadData( 1 , true );
    }

    onChangePage ( paged : number ) : void {
        this.loadData( paged , false );
    }

    addNewItem () : void {
        if ( !this.permissionControl.canCreate ) {
            return;
        }
        this.eventObserver$.next( { name : 'OPEN_FORM_ADD' , data : null } );
    }

    editRow ( row : TrainingMode ) : void {
        if ( !this.permissionControl.canUpdate ) {
            return;
        }
        this.eventObserver$.next( { name : 'OPEN_FORM_UPDATE' , data : row } );
    }

    deleteRow ( row : TrainingMode ) : void {
        if ( !this.permissionControl.canDelete ) {
            return;
        }
        this.notification.confirmDelete( 1 ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            this.trainingModeService.delete( row.id ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( 'Xóa hình thức đào tạo thành công' );
                    this.loadData( this._temp.paged , false );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa hình thức đào tạo thất bại' );
                }
            } );
        } );
    }

    deleteSelectedRows () : void {
        if ( !this.permissionControl.canDelete ) {
            return;
        }
        const selected : TrainingMode[] = this.dataTable.getSelectedData();
        if ( !selected.length ) {
            return;
        }
        this.notification.confirmDelete( selected.length ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            const requests : Observable<any>[] = selected.map( ( item : TrainingMode ) : Observable<any> => this.trainingModeService.delete( item.id ) );
            forkJoin( requests ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( `Xóa thành công ${ selected.length } hình thức đào tạo` );
                    this.loadData( 1 , true );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa danh sách hình thức đào tạo thất bại' );
                }
            } );
        } );
    }

    submitForm () : void {
        const isFormAdd : boolean = this.formControl.isFormAdd;
        if ( isFormAdd && !this.permissionControl.canCreate ) {
            this.notification.toastWarning( 'Bạn không có quyền thêm hình thức đào tạo' );
            return;
        }
        if ( !isFormAdd && !this.permissionControl.canUpdate ) {
            this.notification.toastWarning( 'Bạn không có quyền cập nhật hình thức đào tạo' );
            return;
        }
        if ( this.f.invalid ) {
            this.f.markAllAsTouched();
            this.notification.toastWarning( 'Vui lòng kiểm tra lại thông tin' );
            return;
        }

        const value : Partial<TrainingMode> = this.f.getRawValue();
        const request : Observable<any> = isFormAdd
            ? this.trainingModeService.create( value )
            : this.trainingModeService.update( this.formControl.object.id , value );
        const messageSuccess : string = isFormAdd ? 'Thêm mới hình thức đào tạo thành công' : 'Cập nhật hình thức đào tạo thành công';
        const messageError : string = isFormAdd ? 'Thêm mới hình thức đào tạo thất bại' : 'Cập nhật hình thức đào tạo thất bại';

        this.formControl.submit( request ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : () : void => {
                this.notification.toastSuccess( messageSuccess );
                this.formControl.closeForm();
                this.loadData( this._temp.paged , isFormAdd );
            } ,
            error : () : void => {
                this.notification.toastError( messageError );
            }
        } );
    }
}
