import { Component , inject , OnDestroy , OnInit , signal , Signal , viewChild , WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder , FormGroup , FormsModule , ReactiveFormsModule , Validators } from '@angular/forms';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { DonVi , NganhBomon } from '@models/danh-muc';
import { DanhMucService } from '@services/danh-muc.service';
import { NotificationService } from '@services/notification.service';
import { DataTableEvent , DataTableEventName , IctuDataTable2 , IctuDataTablePaginatorInfo } from '@models/datatable';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { AppState } from '@models/app-state';
import { DtoObject } from '@models/dto';
import { forkJoin , Observable , Subject , takeUntil } from 'rxjs';

@Component( {
    selector    : 'app-dm-bomon' ,
    imports     : [
        CommonModule ,
        FormsModule ,
        ReactiveFormsModule ,
        Drawer ,
        InputText ,
        Textarea ,
        Select ,
        MatButton ,
        MatCheckbox ,
        IctuPaginatorComponent ,
        LoadingProgressComponent
    ] ,
    templateUrl : './nganh-bomon.component.html' ,
    styleUrl    : './nganh-bomon.component.css' ,
    standalone  : true
} )
export class DmBomonComponent implements OnInit , OnDestroy {

    private readonly fb : FormBuilder = inject( FormBuilder );

    private readonly danhMucService : DanhMucService = inject( DanhMucService );

    private readonly notification : NotificationService = inject( NotificationService );

    private readonly destroy$ : Subject<void> = new Subject<void>();

    private readonly eventObserver$ : Subject<DataTableEvent<NganhBomon>> = new Subject<DataTableEvent<NganhBomon>>();

    readonly state : WritableSignal<AppState> = signal<AppState>( 'loading' );

    readonly drawer : Signal<Drawer> = viewChild<Drawer>( 'pDrawer' );

    readonly dataTable : IctuDataTable2<NganhBomon> = new IctuDataTable2<NganhBomon>( {
        rows         : 20 ,
        pageLinkSize : 5
    } );

    dmDonviChuyenmon : DonVi[] = [];

    selectedDonviId : number | null = null;

    readonly formControl : IctuFormControl2<NganhBomon> = new IctuFormControl2<NganhBomon>( {
        dropdownFields : [] ,
        formGroup      : this.fb.group( {
            title              : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 255 ) ] ] ,
            code               : [ '' , [ Validators.required , Validators.minLength( 2 ) , Validators.maxLength( 50 ) ] ] ,
            slug               : [ '' , [ Validators.required ] ] ,
            donvi_chuyenmon_id : [ null , [ Validators.required ] ] ,
            desc               : [ '' ] ,
            status             : [ 1 ] ,
            type               : [ 'bomon' ]
        } ) ,
        objectName     : 'bộ môn' ,
        drawer         : this.drawer
    } );

    slugIsValid : boolean = true;

    _search : string = '';

    private _temp : IctuDataTablePaginatorInfo = { paged : 1 , resetPaginator : true };

    private readonly handleEvent : Record<DataTableEventName , ( data : NganhBomon ) => void> = {
        OPEN_FORM_ADD        : () : void => {
            this.f.reset( {
                title              : '' ,
                code               : '' ,
                slug               : '' ,
                donvi_chuyenmon_id : this.selectedDonviId || ( this.dmDonviChuyenmon[ 0 ]?.id ?? null ) ,
                desc               : '' ,
                status             : 1 ,
                type               : 'bomon'
            } );
            this.slugIsValid = true;
            this.formControl.openFormAdd();
        } ,
        OPEN_FORM_UPDATE     : ( data : NganhBomon ) : void => {
            this.f.reset( {
                title              : data.title ,
                code               : data.code ,
                slug               : data.slug || '' ,
                donvi_chuyenmon_id : data.donvi_chuyenmon_id ,
                desc               : data.desc || '' ,
                status             : data.status ?? 1 ,
                type               : 'bomon'
            } );
            this.slugIsValid = true;
            this.formControl.openFormEdit( data );
        } ,
        DELETE_SINGLE_ROW    : ( data : NganhBomon ) : void => {
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
        ).subscribe( ( { name , data } : DataTableEvent<NganhBomon> ) : void => this.handleEvent[ name ]( data ) );
    }

    ngOnInit () : void {
        this.loadDonViAndData();
    }

    ngOnDestroy () : void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadDonViAndData () : void {
        this.danhMucService.getDonViList().pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next : ( list : DonVi[] ) : void => {
                this.dmDonviChuyenmon = list;
                this.loadData( 1 , true );
            } ,
            error : () : void => {
                this.loadData( 1 , true );
            }
        } );
    }

    loadData ( paged : number = 1 , resetPaginator : boolean = true ) : void {
        this.state.set( 'loading' );
        this._temp = { paged , resetPaginator };
        const donviId : number | undefined = this.selectedDonviId ?? undefined;
        this.danhMucService.loadNganhBomon( 'bomon' , this._search , paged , this.dataTable.paginator.rows() , donviId ).pipe(
            takeUntil( this.destroy$ )
        ).subscribe( {
            next  : ( response : DtoObject<NganhBomon[]> ) : void => {
                const mappedData : NganhBomon[] = ( response.data || [] ).map( ( item : NganhBomon ) : NganhBomon => ( {
                    ...item ,
                    khoa : this.dmDonviChuyenmon.find( ( u : DonVi ) : boolean => u.id === item.donvi_chuyenmon_id )?.title || ''
                } ) );
                this.dataTable.fillRawData( { ...response , data : mappedData } , { paged , resetPaginator } );
                this.state.set( 'success' );
            } ,
            error : () : void => {
                this.state.set( 'error' );
                this.notification.toastError( 'Không tải được danh mục bộ môn' );
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

    onChangeDonvi ( donviId : number | null ) : void {
        this.selectedDonviId = donviId;
        this.loadData( 1 , true );
    }

    onChangePage ( paged : number ) : void {
        this.loadData( paged , false );
    }

    addNewItem () : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_ADD' , data : null } );
    }

    editRow ( row : NganhBomon ) : void {
        this.eventObserver$.next( { name : 'OPEN_FORM_UPDATE' , data : row } );
    }

    onChangeTitle () : void {
        const title : string = ( this.f.get( 'title' )?.value || '' ).trim();
        if ( !title ) {
            return;
        }
        const slug : string = this.slugify( title );
        this.f.get( 'slug' )?.setValue( slug );
        this.checkSlug( slug );
    }

    checkSlug ( slug? : string ) : void {
        const value : string = ( slug || this.f.get( 'slug' )?.value || '' ).trim();
        if ( !value ) {
            this.slugIsValid = true;
            return;
        }
        const excludeId : number | undefined = this.formControl.isFormEdit && this.formControl.object ? this.formControl.object.id : undefined;
        this.danhMucService.checkNganhBomonSlugExists( value , 'bomon' , excludeId ).subscribe( {
            next  : ( exists : boolean ) : void => {
                this.slugIsValid = !exists;
            } ,
            error : () : void => {
                this.slugIsValid = true;
            }
        } );
    }

    deleteRow ( row : NganhBomon ) : void {
        this.notification.confirmDelete( 1 ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            this.danhMucService.deleteNganhBomon( row.id ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( 'Xóa bộ môn thành công' );
                    this.loadData( this._temp.paged , false );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa bộ môn thất bại' );
                }
            } );
        } );
    }

    deleteSelectedRows () : void {
        const selected : NganhBomon[] = this.dataTable.getSelectedData();
        if ( !selected.length ) {
            return;
        }
        this.notification.confirmDelete( selected.length ).subscribe( ( confirmed : boolean ) : void => {
            if ( !confirmed ) {
                return;
            }
            const requests : Observable<any>[] = selected.map( ( d : NganhBomon ) : Observable<any> => this.danhMucService.deleteNganhBomon( d.id ) );
            forkJoin( requests ).subscribe( {
                next  : () : void => {
                    this.notification.toastSuccess( `Xóa thành công ${ selected.length } bộ môn` );
                    this.loadData( 1 , true );
                } ,
                error : () : void => {
                    this.notification.toastError( 'Xóa danh sách bộ môn thất bại' );
                }
            } );
        } );
    }

    submitForm () : void {
        if ( this.f.invalid || !this.slugIsValid ) {
            this.f.markAllAsTouched();
            this.notification.toastWarning( 'Vui lòng kiểm tra lại thông tin' );
            return;
        }

        const value : Partial<NganhBomon> = this.f.getRawValue();
        const request : Observable<any> = this.formControl.isFormAdd
            ? this.danhMucService.createNganhBomon( value )
            : this.danhMucService.updateNganhBomon( this.formControl.object.id , value );

        const messageSuccess : string = this.formControl.isFormAdd ? 'Thêm mới bộ môn thành công' : 'Cập nhật bộ môn thành công';
        const messageError : string = this.formControl.isFormAdd ? 'Thêm mới bộ môn thất bại' : 'Cập nhật bộ môn thất bại';

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

    private slugify ( value : string ) : string {
        return value.normalize( 'NFD' ).replace( /[̀-ͯ]/g , '' ).toLowerCase().replace( /đ/g , 'd' ).replace( /[^a-z0-9]+/g , '-' ).replace( /(^-|-$)/g , '' );
    }
}
