import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto, DtoObject } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { CourseFormDg, SINHDEDG } from '@models/dtkh/course-form-dg';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({
    providedIn: 'root'
})
export class CourseFormDgService {
    private readonly http = inject(HttpClient);
    readonly api = getApiRouteLink('course-form-dg/');

    addCourseFormDg(data: Partial<CourseFormDg>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    deleteCourseFormDg(id: number): Observable<unknown> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    deleteCourseFormDgByCol(item: string, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${item}`, { params }).pipe(map(res => res.data));
    }

    sinhde(data: SINHDEDG): Observable<unknown> {
        return this.http.post<Dto>(`${this.api}sinhde`, data);
    }

    getCourseFormDgByPage(option: ConditionOption): Observable<{ data: CourseFormDg[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) params = params.set('paged', option.page);
        for (const item of option.set || []) {
            params = params.set(item.label, item.value);
        }
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CourseFormDg[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }

    getCoursePlansByPageNew(option: ConditionOption): Observable<{ data: CourseFormDg[]; recordsFiltered: number }> {
        return this.getCourseFormDgByPage(option);
    }
}