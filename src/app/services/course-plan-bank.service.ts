import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { CoursePlanBank } from '@models/dtkh/course-plan-bank';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({
    providedIn: 'root'
})
export class CoursePlanBankService {
    private readonly http = inject(HttpClient);
    readonly api = getApiRouteLink('course-plan-bank/');

    addCoursePlanBank(data: Partial<CoursePlanBank>): Observable<number> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCoursePlanBank(id: number, data: Partial<CoursePlanBank>): Observable<unknown> {
        return this.http.put<Dto>(`${this.api}${id}`, data).pipe(map(res => res.data));
    }

    deleteCoursePlanBank(id: number | string): Observable<unknown> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    deleteCoursePlanBankByCol(id: number | string, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${id}`, { params }).pipe(map(res => res.data));
    }

    getCoursePlanBankByPageNew(option: ConditionOption): Observable<{ data: CoursePlanBank[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) params = params.set('paged', option.page);
        for (const item of option.set || []) {
            params = params.set(item.label, item.value);
        }
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CoursePlanBank[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }
}