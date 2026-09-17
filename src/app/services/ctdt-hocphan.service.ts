import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CtdtHocphan } from '@models/dtkh/ctdt_hocphan';
import { Dto, DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CtdtHocphanService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('ctdt-hocphan/');

    addCtdtHocphan(data: Partial<CtdtHocphan>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    updateCtdtHocphan(id: number, data: Partial<CtdtHocphan>): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map(res => res.data));
    }

    deleteCtdtHocphan(id: number): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map(res => res.data));
    }

    deleteCtdtHocphanByCol(id: number, col: string): Observable<unknown> {
        const by = new HttpParams().set('by', col);
        return this.http.delete<Dto>(this.api.concat(id.toString()), { params: by });
    }

    getCtdtHocphanByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<DtoObject<CtdtHocphan[]>> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<DtoObject<CtdtHocphan[]>>(this.api, { params });
    }
}
