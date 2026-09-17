import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Dto, DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { CourseCloContribute } from '@models/dtkh/course-clo-contribute';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CourseCloContributeService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('course-clo-contribute/');

    addCourseCloContribute(data: Partial<CourseCloContribute>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    deleteCourseCloContributeByCol(id: string, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(this.api.concat(id), { params }).pipe(map(res => res.data));
    }

    getCourseCloContributeByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<DtoObject<CourseCloContribute[]>> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<DtoObject<CourseCloContribute[]>>(this.api, { params });
    }
}
