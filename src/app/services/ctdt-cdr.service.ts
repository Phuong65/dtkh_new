import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Dto, DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { CtdtCdr } from '@models/dtkh/ctdt-cdr';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CtdtCdrService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('ctdt-cdr/');

    addCtdtCdr(data: Partial<CtdtCdr>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    updateCtdtCdr(id: number, data: Partial<CtdtCdr>): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map(res => res.data));
    }

    deleteCtdtCdr(id: number): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map(res => res.data));
    }

    getCtdtCdrByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<DtoObject<CtdtCdr[]>> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<DtoObject<CtdtCdr[]>>(this.api, { params });
    }
}
