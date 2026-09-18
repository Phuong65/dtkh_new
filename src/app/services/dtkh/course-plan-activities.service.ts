import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Dto, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { ConditionOption } from '@services/dtkh/elearning-khoa-hoc.service';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

export interface SINHDE {
    course_id: number;
    week: number;
    type: 'CC' | 'TX';
}

@Injectable({ providedIn: 'root' })
export class CoursePlanActivitiesService {

    private readonly http: HttpClient = inject(HttpClient);

    private readonly api: string = getApiRouteLink('course-plan-activities/');

    addCoursePlanActivities(data: unknown): Observable<unknown> {
        return this.http.post<Dto>(this.api, data).pipe(map((res: Dto) => res.data));
    }

    updateCoursePlanActivities(id: number | string, data: unknown): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map((res: Dto) => res.data));
    }

    updateCoursePlanActivitiesByCol(id: number | string, data: unknown, col: string): Observable<unknown> {
        const by: HttpParams = new HttpParams().set('by', col);
        return this.http.put<Dto>(this.api.concat(id.toString()), data, { params: by }).pipe(map((res: Dto) => res.data));
    }

    deleteCoursePlanActivities(id: number | string): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map((res: Dto) => res.data));
    }

    getCoursePlanActivitiesByPageNew(option: ConditionOption): Observable<{ data: CoursePlanActivities[]; recordsFiltered: number }> {
        let filter: HttpParams = option.page
            ? paramsConditionBuilder(option.condition).set('paged', option.page)
            : paramsConditionBuilder(option.condition);
        if (option.set?.length) {
            option.set.forEach((s: { label: string; value: string }): void => {
                filter = filter.set(s.label, s.value);
            });
        }
        return this.http.get<Dto>(this.api, { params: filter }).pipe(
            map((res: Dto) => ({ data: res.data, recordsFiltered: res.recordsFiltered })),
        );
    }

    sinhde(data: SINHDE): Observable<unknown> {
        return this.http.post<Dto>(this.api.concat('sinhde'), data).pipe(map((res: Dto) => res));
    }

    query<T>(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<T[]> {
        const params: HttpParams = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams }));
        return this.http.get<Dto>(this.api, { params }).pipe(map((res: Dto) => res.data));
    }
}
