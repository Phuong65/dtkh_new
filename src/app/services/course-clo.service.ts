import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Dto, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { CourseClo } from '@models/dtkh/course-clo';
import { map } from 'rxjs/operators';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CourseCloService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly api: string = getApiRouteLink('course-clo/');

    addCourseClo(data: any): Observable<any> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCourseClo(id: number, data: any): Observable<any> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map(res => res.data));
    }

    deleteCourseClo(id: number): Observable<any> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map(res => res.data));
    }

    deleteCourseCloByCol(id: number, col: string): Observable<any> {
        const by = new HttpParams().set('by', col);
        return this.http.delete<Dto>(this.api.concat(id.toString()), { params: by });
    }

    getCourseCloByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<{ data: CourseClo[]; recordsFiltered: number }> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: res.data, recordsFiltered: res.recordsFiltered }))
        );
    }
}