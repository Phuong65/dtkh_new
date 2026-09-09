import { inject , Injectable } from '@angular/core';
import { User } from "@models/user";
import { HttpClient , HttpParams } from "@angular/common/http";
import { map , Observable } from "rxjs";
import { DtoObject } from "@models/dto";
import { getApiRouteLink } from "@env";

export type UserUpdatableFields = Pick<User , 'display_name' | 'phone' | 'email' | 'password'>

export type AdminUserPayload = Pick<User , 'username' | 'display_name' | 'phone' | 'email' | 'password' | 'status'>;

@Injectable( {
	providedIn : 'any'
} )
export class UserService {

	private readonly apiRegister : string = getApiRouteLink( 'register' );

	private readonly apiProfile : string = getApiRouteLink( 'profile' );

	private http : HttpClient = inject( HttpClient );

	update ( info : Partial<UserUpdatableFields> ) : Observable<number> {
		return this.http.put<DtoObject<number>>( this.apiProfile , info ).pipe( map( ( response : DtoObject<number> ) : number => response.data ) );
	}

	listForAdministration () : Observable<User[]> {
		const params : HttpParams = new HttpParams().set( 'limit' , '-1' ).set( 'orderby' , 'id' ).set( 'order' , 'DESC' );
		return this.http.get<DtoObject<User[]>>( getApiRouteLink( 'users' ) , { params } ).pipe( map( ( response : DtoObject<User[]> ) : User[] => response.data || [] ) );
	}

	createForAdministration ( info : AdminUserPayload ) : Observable<number> {
		return this.http.post<DtoObject<number>>( getApiRouteLink( 'users' ) , info ).pipe( map( ( response : DtoObject<number> ) : number => response.data ) );
	}

	updateForAdministration ( id : number , info : Partial<AdminUserPayload> ) : Observable<number> {
		return this.http.put<DtoObject<number>>( getApiRouteLink( [ 'users' , id ].join( '/' ) ) , info ).pipe( map( ( response : DtoObject<number> ) : number => response.data ) );
	}

	deleteForAdministration ( id : number ) : Observable<number> {
		return this.http.delete<DtoObject<number>>( getApiRouteLink( [ 'users' , id ].join( '/' ) ) ).pipe( map( ( response : DtoObject<number> ) : number => response.data ) );
	}
}
