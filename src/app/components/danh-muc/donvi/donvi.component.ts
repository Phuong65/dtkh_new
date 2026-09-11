import { Component , inject , OnDestroy , OnInit , signal , Signal , viewChild , WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { DonVi } from '@models/danh-muc';
import { DanhMucService } from '@services/danh-muc.service';
import { NotificationService } from '@services/notification.service';
import { DataTableEvent , DataTableEventName , IctuDataTable2 , IctuDataTablePaginatorInfo } from '@models/datatable';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { AppState } from '@models/app-state';
import { DtoObject } from '@models/dto';
import { forkJoin , Observable , Subject , takeUntil } from 'rxjs';

@Component( {
    selector    : 'app-donvi' ,
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
    templateUrl : './donvi.component.html' ,
    styleUrl    : './donvi.component.css' ,
    standalone  : true
} )
export class DonviComponent implements OnInit , OnDestroy {

    private readonly fb : FormBuilder = inject( FormBuilder );

    private readonly danhMucService : DanhMucService = inject( DanhMucService );

    private readonly notification : NotificationService = inject( NotificationService );

    private readonly destroy$ : Subject<void> = new Subject<void>();

    private readonly eventObserver$ : Subject<DataTableEvent<DonVi>> = new Subject<DataTableEvent<DonVi>>();

    readonly state : WritableSignal<AppState> = signal<AppState>( 'loading' );

    readonly drawer : Signal<Drawer> = viewChild<Drawer>( 'pDrawer' );

    readonly dataTable : IctuDataTable2<DonVi> = new IctuDataTable2<DonVi>( {
        rows         : 20 ,
        pageLinkSize : 5
    } );

    readonly formControl : IctuFormControl2<DonVi> = new IctuFormControl2<DonVi>( {
        dropdownFields : [] ,
        formGroup      : this.fb.group( {
            title       : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 255 ) ] ] ,
            code        : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 50 ) ] ] ,
            description : [ '' ] ,
            parent_id   : [ 0 ] ,
            status      : [ 1 ]
        } ) ,
        objectName     : 'đơn vị' ,
        drawer         : this.drawer
    } );

    codeIsValid : boolean = true;

    _search : string = '';

    private _temp : IctuDataTablePaginatorInfo = { paged : 1 , resetPaginator : true };

    private readonly handleEvent : Record<DataTableEventName , ( data : DonVi ) => void> = {
        OPEN_FORM_ADD        : () : void => {
            this.f.reset( {
                title       : '' ,
                code        : '' ,
                description : '' ,
                parent_id   : 0 ,
                status      : 1
            } );
            this.codeIsValid = true;
            this.formControl.openFormAdd();
        } ,
        OPEN_FORM_UPDATE     : ( data : DonVi ) : void => {
            this.f.reset( {
                title       : data.title ,
                code        : data.code ,
                description : data.description || '' ,
                parent_id   : data.parent_id || 0 ,
                status      : data.status
            } );
            this.codeIsValid = true;
            this.formControl.openFormEdit( data );
        } ,
        DELETE_SINGLE_ROW    : ( data : DonVi ) : void => {
            this.deleteRow( data );
        } ,
        DELETE_SELECTED_ROWS : () : void => {
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
        ).subscribe( ( { name , data } : DataTableEvent<DonVi> ) : void => this.handleEvent[ name ]( data ) );
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
        this.danhMucService.loadDonVi( this._search , paged , this.dataTable.paginator.rows() , 0 ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : ( response : DtoObject<DonVi[]> ) : void => {
                this.dataTable.fillRawData( response , { paged , resetPaginator } );
                this.state.set( 'success' );
            } ,
            error : () : void => {
                this.state.set( 'error' );
                this.notification.toastError( 'Không tải được danh mục khoa' );
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
        this.eventObserver$.next( { name : 'OPEN_FORM_ADD' , data : null } );
    }

    editRow ( row : DonVi ) : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_UPDATE' , data : row } );
    }

    onChangeCode () : void {
        const code : string = ( this.f.get( 'code' )?.value || '' ).trim();
        if ( !code ) {
            this.codeIsValid = true;
            return;
        }
        const excludeId : number | undefined = this.formControl.isFormEdit && this.formControl.object ? this.formControl.object.id : undefined;
        this.danhMucService.checkDonViCodeExists( code , excludeId ).subscribe( {
            next : ( exists : boolean ) : void => {
                this.codeIsValid = !exists;
            }
        } );
    }

    deleteRow ( row : DonVi ) : void {
        this.notification.confirmDelete( 1 ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            this.danhMucService.deleteDonVi( row.id ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( 'Xóa khoa thành công' );
                    this.loadData( this._temp.paged , false );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa khoa thất bại' );
                }
            } );
        } );
    }

    deleteSelectedRows () : void {
        const selected : DonVi[] = this.dataTable.getSelectedData();
        if ( !selected.length ) {
            return;
        }
        this.notification.confirmDelete( selected.length ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            const requests : Observable<any>[] = selected.map( ( d : DonVi ) : Observable<any> => this.danhMucService.deleteDonVi( d.id ) );
            forkJoin( requests ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( `Xóa thành công ${ selected.length } khoa` );
                    this.loadData( 1 , true );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa danh sách khoa thất bại' );
                }
            } );
        } );
    }

    submitForm () : void {
        if ( this.f.invalid || !this.codeIsValid ) {
            this.f.markAllAsTouched();
            this.notification.toastWarning( 'Vui lòng kiểm tra lại thông tin' );
            return;
        }

        const value : Partial<DonVi> = this.f.getRawValue();
        const request : Observable<any> = this.formControl.isFormAdd
            ? this.danhMucService.createDonVi( value )
            : this.danhMucService.updateDonVi( this.formControl.object.id , value );

        const messageSuccess : string = this.formControl.isFormAdd ? 'Thêm mới khoa thành công' : 'Cập nhật khoa thành công';
        const messageError : string = this.formControl.isFormAdd ? 'Thêm mới khoa thất bại' : 'Cập nhật khoa thất bại';

        this.formControl.submit( request ).subscribe( {
            next  : () : void => {
                this.notification.toastSuccess( messageSuccess );
                this.formControl.closeForm();
                this.loadData( this._temp.paged , this.formControl.isFormAdd );
            } ,
            error : () : void => {
                this.notification.toastError( messageError );
            }
        } );
    }
}
