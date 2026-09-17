import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Dto, DtoObject, IctuConditionParam, IctuQueryCondition, IctuQueryParams } from '@models/dto';
import { CourseMuctieuChitiet } from '@models/dtkh/course-muctieu-chitiet';
import { map } from 'rxjs/operators';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CourseMuctieuChitietService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly api: string = getApiRouteLink('course-muctieu-chitiet/');

    addCourseMuctieuChitiet(data: any): Observable<any> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCourseMuctieuChitiet(id: number, data: any): Observable<any> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map(res => res.data));
    }

    deleteCourseMuctieuChitiet(id: number): Observable<any> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map(res => res.data));
    }

    getCourseMuctieuChitietByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<{ data: CourseMuctieuChitiet[]; recordsFiltered: number }> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: res.data, recordsFiltered: res.recordsFiltered }))
        );
    }
}