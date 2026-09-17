import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Ctdt } from '@models/dtkh/ctdt';
import { Dto, DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CtdtService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('ctdt/');

    addCtdt(data: Partial<Ctdt>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    updateCtdt(id: number, data: Partial<Ctdt>): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map(res => res.data));
    }

    deleteCtdt(id: number): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map(res => res.data));
    }

    getCtdtByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<DtoObject<Ctdt[]>> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<DtoObject<Ctdt[]>>(this.api, { params });
    }
}
