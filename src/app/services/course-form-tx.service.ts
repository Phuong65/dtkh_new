import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto, DtoObject } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { CourseFormTx, SINHDETX } from '@models/dtkh/course-form-tx';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({
    providedIn: 'root'
})
export class CourseFormTxService {
    private readonly http = inject(HttpClient);
    readonly api = getApiRouteLink('course-form-tx/');

    addCourseFormTx(data: Partial<CourseFormTx>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    deleteCourseFormTx(id: number | string): Observable<unknown> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    deleteCourseFormTxByCol(item: string, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${item}`, { params }).pipe(map(res => res.data));
    }

    getCourseFormTxByPage(option: ConditionOption): Observable<{ data: CourseFormTx[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) params = params.set('paged', option.page);
        for (const item of option.set || []) {
            params = params.set(item.label, item.value);
        }
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CourseFormTx[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }

    getCoursePlansByPageNew(option: ConditionOption): Observable<{ data: CourseFormTx[]; recordsFiltered: number }> {
        return this.getCourseFormTxByPage(option);
    }

    sinhde(data: SINHDETX): Observable<unknown> {
        return this.http.post<Dto>(`${this.api}sinhde`, data);
    }
}