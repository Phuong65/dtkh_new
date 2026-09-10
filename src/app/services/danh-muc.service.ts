import { inject , Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';
import { map , Observable } from 'rxjs';
import { Dto , DtoObject } from '@models/dto';
import { DonVi , NganhBomon } from '@models/danh-muc';
import { getApiRouteLink } from '@env';

@Injectable( {
    providedIn : 'root'
} )
export class DanhMucService {

    private readonly http : HttpClient = inject( HttpClient );

    private readonly apiDonvi : string = getApiRouteLink( 'donvi' );

    private readonly apiNganhBomon : string = getApiRouteLink( 'nganh-bomon' );

    loadDonVi ( search : string = '' , paged : number = 1 , limit : number = 15 , parentId : number = 0 ) : Observable<DtoObject<DonVi[]>> {
        let params : HttpParams = new HttpParams()
            .set( 'paged' , paged.toString() )
            .set( 'limit' , limit.toString() )
            .set( 'orderby' , 'title' )
            .set( 'order' , 'ASC' );
        if ( parentId !== undefined ) {
            params = params.set( 'parent_id' , parentId.toString() );
        }
        if ( search ) {
            params = params.set( 'search' , search );
        }
        return this.http.get<any>( this.apiDonvi , { params } ).pipe(
            map( ( res : any ) : DtoObject<DonVi[]> => {
                if ( res && Array.isArray( res.data ) ) {
                    const data : DonVi[] = res.data;
                    const recordsFiltered : number = res.recordsFiltered ?? res.recordsTotal ?? data.length;
                    const recordsTotal : number = res.recordsTotal ?? data.length;
                    return {
                        draw : res.draw ?? 1 ,
                        recordsTotal ,
                        recordsFiltered ,
                        data
                    };
                }
                const list : DonVi[] = Array.isArray( res ) ? res : [];
                return {
                    draw : 1 ,
                    recordsTotal : list.length ,
                    recordsFiltered : list.length ,
                    data : list
                };
            } )
        );
    }

    getDonViList ( parentId? : number ) : Observable<DonVi[]> {
        let params : HttpParams = new HttpParams()
            .set( 'limit' , '-1' )
            .set( 'orderby' , 'title' )
            .set( 'order' , 'ASC' );
        if ( parentId !== undefined ) {
            params = params.set( 'parent_id' , parentId.toString() );
        }
        return this.http.get<Dto>( this.apiDonvi , { params } ).pipe(
            map( ( response : Dto ) : DonVi[] => Array.isArray( response.data ) ? response.data : [] )
        );
    }

    listDonVi ( filter : { status? : number } = {} ) : Observable<DonVi[]> {
        let params : HttpParams = new HttpParams().set( 'limit' , '-1' ).set( 'orderby' , 'title' ).set( 'order' , 'ASC' );
        if ( filter.status !== undefined ) {
            params = params.set( 'status' , filter.status.toString() );
        }
        return this.http.get<Dto>( this.apiDonvi , { params } ).pipe(
            map( ( response : Dto ) : DonVi[] => Array.isArray( response.data ) ? response.data : [] )
        );
    }

    createDonVi ( data : Partial<DonVi> ) : Observable<number> {
        return this.http.post<DtoObject<number>>( this.apiDonvi , data ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    updateDonVi ( id : number , data : Partial<DonVi> ) : Observable<number> {
        return this.http.put<DtoObject<number>>( `${ this.apiDonvi }/${ id }` , data ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    deleteDonVi ( id : number ) : Observable<number> {
        return this.http.delete<DtoObject<number>>( `${ this.apiDonvi }/${ id }` ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    checkDonViCodeExists ( code : string , excludeId? : number ) : Observable<boolean> {
        const params : HttpParams = new HttpParams().set( 'code' , code ).set( 'limit' , '1' );
        return this.http.get<Dto>( this.apiDonvi , { params } ).pipe(
            map( ( response : Dto ) : boolean => {
                const list : DonVi[] = Array.isArray( response.data ) ? response.data : [];
                return list.some( ( item : DonVi ) : boolean => excludeId === undefined || item.id !== excludeId );
            } )
        );
    }

    checkCodeExists ( code : string , excludeId? : number ) : Observable<boolean> {
        return this.checkDonViCodeExists( code , excludeId );
    }

    loadNganhBomon ( type : 'nganh' | 'bomon' , search : string = '' , paged : number = 1 , limit : number = 15 , donviChuyenMonId? : number ) : Observable<DtoObject<NganhBomon[]>> {
        let params : HttpParams = new HttpParams()
            .set( 'type' , type )
            .set( 'paged' , paged.toString() )
            .set( 'limit' , limit.toString() )
            .set( 'orderby' , 'ordering' )
            .set( 'order' , 'ASC' );
        if ( donviChuyenMonId !== undefined && donviChuyenMonId !== null ) {
            params = params.set( 'donvi_chuyenmon_id' , donviChuyenMonId.toString() );
        }
        if ( search ) {
            params = params.set( 'search' , search );
        }
        return this.http.get<any>( this.apiNganhBomon , { params } ).pipe(
            map( ( res : any ) : DtoObject<NganhBomon[]> => {
                if ( res && Array.isArray( res.data ) ) {
                    return {
                        draw            : res.draw ?? 1 ,
                        recordsTotal    : res.recordsTotal ?? res.data.length ,
                        recordsFiltered : res.recordsFiltered ?? res.recordsTotal ?? res.data.length ,
                        data            : res.data
                    };
                }
                const list : NganhBomon[] = Array.isArray( res ) ? res : [];
                return { draw : 1 , recordsTotal : list.length , recordsFiltered : list.length , data : list };
            } )
        );
    }

    getNganhBomonList ( type : 'nganh' | 'bomon' , donviChuyenMonId? : number ) : Observable<NganhBomon[]> {
        let params : HttpParams = new HttpParams()
            .set( 'type' , type )
            .set( 'limit' , '-1' )
            .set( 'orderby' , 'ordering' )
            .set( 'order' , 'ASC' );
        if ( donviChuyenMonId !== undefined ) {
            params = params.set( 'donvi_chuyenmon_id' , donviChuyenMonId.toString() );
        }
        return this.http.get<Dto>( this.apiNganhBomon , { params } ).pipe(
            map( ( response : Dto ) : NganhBomon[] => Array.isArray( response.data ) ? response.data : [] )
        );
    }

    createNganhBomon ( data : Partial<NganhBomon> ) : Observable<number> {
        return this.http.post<DtoObject<number>>( this.apiNganhBomon , data ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    updateNganhBomon ( id : number , data : Partial<NganhBomon> ) : Observable<number> {
        return this.http.put<DtoObject<number>>( `${ this.apiNganhBomon }/${ id }` , data ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    deleteNganhBomon ( id : number ) : Observable<number> {
        return this.http.delete<DtoObject<number>>( `${ this.apiNganhBomon }/${ id }` ).pipe(
            map( ( response : DtoObject<number> ) : number => response.data )
        );
    }

    checkNganhBomonSlugExists ( slug : string , type : 'nganh' | 'bomon' , excludeId? : number ) : Observable<boolean> {
        const params : HttpParams = new HttpParams().set( 'slug' , slug ).set( 'type' , type ).set( 'limit' , '1' );
        return this.http.get<Dto>( this.apiNganhBomon , { params } ).pipe(
            map( ( response : Dto ) : boolean => {
                const list : NganhBomon[] = Array.isArray( response.data ) ? response.data : [];
                return list.some( ( item : NganhBomon ) : boolean => excludeId === undefined || item.id !== excludeId );
            } )
        );
    }
}
