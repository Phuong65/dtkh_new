import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto } from '@models/dto';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';
import { ConditionOption } from '@models/condition-option';

@Injectable({
    providedIn: 'root'
})
export class CoursePlanActivitiesService {
    readonly api: string = getApiRouteLink('course-plan-activities/');

    constructor(private http: HttpClient) { }

    addCoursePlanActivities(data: any): Observable<any> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCoursePlanActivities(id: number, data: any): Observable<any> {
        return this.http.put<Dto>(`${this.api}${id}`, data).pipe(map(res => res.data));
    }

    deleteCoursePlanActivities(id: number): Observable<any> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    deleteCoursePlanActivitiesByCol(id: string | number, col: string): Observable<any> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${id}`, { params });
    }

    getCoursePlanActivitiesByPageNew(option: ConditionOption): Observable<{ data: CoursePlanActivities[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) {
            params = params.set('paged', option.page);
        }
        for (const item of option.set || []) {
            params = params.set(item.label, item.value);
        }
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CoursePlanActivities[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }
}
