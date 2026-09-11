import { CommonModule } from '@angular/common';
import { Component , inject , OnDestroy , OnInit , signal , Signal , viewChild , WritableSignal } from '@angular/core';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { forkJoin , Observable , Subject , takeUntil } from 'rxjs';
import { ClassManagement } from '@models/class-management';
import { DataTableEvent , DataTableEventName , IctuDataTable2 , IctuDataTablePaginatorInfo } from '@models/datatable';
import { AppState } from '@models/app-state';
import { DonVi , NganhBomon } from '@models/danh-muc';
import { DtoObject , IctuConditionParam , IctuQueryCondition , IctuQueryParams } from '@models/dto';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { ClassManagementService } from '@services/class-management.service';
import { DanhMucService } from '@services/danh-muc.service';
import { NotificationService } from '@services/notification.service';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';

@Component( {
    selector    : 'app-khoa-lop' ,
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
    templateUrl : './khoa-lop.component.html' ,
    styleUrl    : './khoa-lop.component.css' ,
    standalone  : true
} )
export class KhoaLopComponent implements OnInit , OnDestroy {

    private readonly fb : FormBuilder = inject( FormBuilder );

    private readonly classManagementService : ClassManagementService = inject( ClassManagementService );

    private readonly danhMucService : DanhMucService = inject( DanhMucService );

    private readonly notification : NotificationService = inject( NotificationService );

    private readonly destroy$ : Subject<void> = new Subject<void>();

    private readonly eventObserver$ : Subject<DataTableEvent<ClassManagement>> = new Subject<DataTableEvent<ClassManagement>>();

    readonly state : WritableSignal<AppState> = signal<AppState>( 'loading' );

    readonly drawer : Signal<Drawer> = viewChild<Drawer>( 'pDrawer' );

    readonly dataTable : IctuDataTable2<ClassManagement> = new IctuDataTable2<ClassManagement>( {
        rows         : 15 ,
        pageLinkSize : 5
    } );

    readonly formControl : IctuFormControl2<ClassManagement> = new IctuFormControl2<ClassManagement>( {
        dropdownFields : [] ,
        formGroup      : this.fb.group( {
            title    : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 255 ) ] ] ,
            kyhieu   : [ '' , [ Validators.required , Validators.maxLength( 50 ) ] ] ,
            khoa     : [ '' , [ Validators.required , Validators.maxLength( 20 ) ] ] ,
            donvi_id : [ null , Validators.required ] ,
            nganh_id : [ null , Validators.required ]
        } ) ,
        objectName : 'lớp quản lý' ,
        drawer     : this.drawer
    } );

    listDonVi : DonVi[] = [];

    listNganh : NganhBomon[] = [];

    listKhoa : Array<string | number> = [];

    _search : string = '';

    selectedDonViId : number | null = null;

    selectedNganhId : number | null = null;

    selectedKhoa : string | number | null = null;

    private _temp : IctuDataTablePaginatorInfo = { paged : 1 , resetPaginator : true };

    private readonly handleEvent : Record<DataTableEventName , ( data : ClassManagement ) => void> = {
        OPEN_FORM_ADD        : () : void => this.addForm() ,
        OPEN_FORM_UPDATE     : ( data : ClassManagement ) : void => this.editForm( data ) ,
        DELETE_SINGLE_ROW    : ( data : ClassManagement ) : void => this.deleteRow( data ) ,
        DELETE_SELECTED_ROWS : () : void => this.deleteSelectedRows() ,
        SUBMIT_FORM          : () : void => this.submitForm()
    };

    get f () : FormGroup {
        return this.formControl.formGroup;
    }

    constructor () {
        this.eventObserver$.pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( { name , data } : DataTableEvent<ClassManagement> ) : void => this.handleEvent[ name ]( data ) );
    }

    ngOnInit () : void {
        this.loadFilterOptions();
    }

    ngOnDestroy () : void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadFilterOptions () : void {
        forkJoin( {
            donVi : this.danhMucService.getDonViList() ,
            nganh : this.danhMucService.getNganhBomonList( 'nganh' ) ,
            khoa  : this.classManagementService.query( [] , { limit : -1 , orderby : 'khoa' , order : 'ASC' } )
        } ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next : ( { donVi , nganh , khoa } : { donVi : DonVi[] , nganh : NganhBomon[] , khoa : DtoObject<ClassManagement[]> } ) : void => {
                this.listDonVi = donVi;
                this.listNganh = nganh;
                const values : Array<string | number> = ( khoa.data || [] ).map( ( item : ClassManagement ) : string | number => item.khoa );
                this.listKhoa = Array.from( new Set( values ) );
                this.loadData( 1 , true );
            } ,
            error : () : void => {
                this.notification.toastWarning( 'Không tải được danh sách bộ lọc' );
                this.loadData( 1 , true );
            }
        } );
    }

    loadData ( paged : number = 1 , resetPaginator : boolean = true ) : void {
        this.state.set( 'loading' );
        this._temp = { paged , resetPaginator };
        const conditions : IctuConditionParam[] = [];
        if ( this.selectedDonViId !== null ) {
            conditions.push( {
                conditionName : 'donvi_id' ,
                condition     : IctuQueryCondition.equal ,
                value         : this.selectedDonViId.toString()
            } );
        }
        if ( this.selectedNganhId !== null ) {
            conditions.push( {
                conditionName : 'nganh_id' ,
                condition     : IctuQueryCondition.equal ,
                value         : this.selectedNganhId.toString()
            } );
        }
        if ( this.selectedKhoa !== null ) {
            conditions.push( {
                conditionName : 'khoa' ,
                condition     : IctuQueryCondition.equal ,
                value         : this.selectedKhoa.toString()
            } );
        }
        if ( this._search.trim() ) {
            conditions.push( {
                conditionName : 'title' ,
                condition     : IctuQueryCondition.like ,
                value         : `%${ this._search.trim() }%`
            } );
        }
        const queryParams : IctuQueryParams = {
            paged ,
            limit   : this.dataTable.paginator.rows() ,
            orderby : 'khoa' ,
            order   : 'ASC'
        };
        this.classManagementService.query( conditions , queryParams ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : ( response : DtoObject<ClassManagement[]> ) : void => {
                const data : ClassManagement[] = response.data.map( ( row : ClassManagement ) : ClassManagement => ( {
                    ...row ,
                    _nganh_converted : this.listNganh.find( ( n : NganhBomon ) : boolean => n.id === row.nganh_id )?.title || '—' ,
                    _donvi_converted : this.listDonVi.find( ( d : DonVi ) : boolean => d.id === row.donvi_id )?.title || '—'
                } ) );
                this.dataTable.fillRawData( { ...response , data } , { paged , resetPaginator } );
                this.state.set( 'success' );
            } ,
            error : () : void => {
                this.state.set( 'error' );
                this.notification.toastError( 'Không tải được danh sách lớp quản lý' );
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

    onChangeFilter () : void {
        this.loadData( 1 , true );
    }

    addNewItem () : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_ADD' , data : null } );
    }

    editRow ( row : ClassManagement ) : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_UPDATE' , data : row } );
    }

    addForm () : void {
        this.f.reset( {
            title    : '' ,
            kyhieu   : '' ,
            khoa     : '' ,
            donvi_id : this.selectedDonViId ,
            nganh_id : this.selectedNganhId
        } );
        this.formControl.openFormAdd();
    }

    editForm ( row : ClassManagement ) : void {
        this.f.reset( {
            title    : row.title ,
            kyhieu   : row.kyhieu ,
            khoa     : row.khoa ,
            donvi_id : row.donvi_id ,
            nganh_id : row.nganh_id
        } );
        this.formControl.openFormEdit( row );
    }

    deleteRow ( row : ClassManagement ) : void {
        this.notification.confirmDelete( 1 ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( confirmed : boolean ) : void => {
            if ( ! confirmed ) {
                return;
            }
            this.classManagementService.delete( row.id ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( 'Xóa lớp quản lý thành công' );
                    this.loadData( this._temp.paged , false );
                } ,
                error : () : void => this.notification.toastError( 'Xóa lớp quản lý thất bại' )
            } );
        } );
    }

    deleteSelectedRows () : void {
        const selected : ClassManagement[] = this.dataTable.getSelectedData();
        if ( ! selected.length ) {
            return;
        }
        this.notification.confirmDelete( selected.length ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( ( confirmed : boolean ) : void => {
            if ( ! confirmed ) {
                return;
            }
            const requests : Observable<any>[] = selected.map( ( row : ClassManagement ) : Observable<any> => this.classManagementService.delete( row.id ) );
            forkJoin( requests ).pipe(
                takeUntil( this.destroy$ )
            ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( `Xóa thành công ${ selected.length } lớp quản lý` );
                    this.loadData( 1 , true );
                } ,
                error : () : void => this.notification.toastError( 'Xóa danh sách lớp quản lý thất bại' )
            } );
        } );
    }

    submitForm () : void {
        if ( this.f.invalid ) {
            this.f.markAllAsTouched();
            this.notification.toastWarning( 'Vui lòng kiểm tra lại thông tin' );
            return;
        }
        const value : Partial<ClassManagement> = this.f.getRawValue();
        const request : Observable<any> = this.formControl.isFormAdd
            ? this.classManagementService.create( value )
            : this.classManagementService.update( this.formControl.object.id , value );
        const messageSuccess : string = this.formControl.isFormAdd ? 'Thêm lớp quản lý thành công' : 'Cập nhật lớp quản lý thành công';
        const messageError : string = this.formControl.isFormAdd ? 'Thêm lớp quản lý thất bại' : 'Cập nhật lớp quản lý thất bại';
        this.formControl.submit( request ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : () : void => {
                this.notification.toastSuccess( messageSuccess );
                this.formControl.closeForm();
                this.loadData( this._temp.paged , this.formControl.isFormAdd );
            } ,
            error : () : void => this.notification.toastError( messageError )
        } );
    }
}
