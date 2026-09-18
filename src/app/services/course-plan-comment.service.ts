import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CoursePlanComment } from '@models/dtkh/course-plan-comment';
import { Dto, DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CoursePlanCommentService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('course-plan-comment/');

    addCoursePlanComment(data: Partial<CoursePlanComment>): Observable<number> {
        return this.http.post<DtoObject<number>>(this.api, data).pipe(map(res => res.data));
    }

    updateCoursePlanComment(id: number, data: Partial<CoursePlanComment>): Observable<unknown> {
        return this.http.put<Dto>(`${this.api}${id}`, data).pipe(map(res => res.data));
    }

    deleteCoursePlanComment(id: number): Observable<unknown> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    deleteCoursePlanCommentByCol(id: number | string, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${id}`, { params }).pipe(map(res => res.data));
    }

    getCoursePlanCommentByPageNew(conditions: IctuConditionParam[] | ConditionOption, queryParams?: IctuQueryParams): Observable<DtoObject<CoursePlanComment[]>> {
        let actualConditions: IctuConditionParam[];
        let actualParams: any = queryParams || {};
        if (Array.isArray(conditions)) {
            actualConditions = conditions;
        } else if (conditions && 'condition' in conditions) {
            actualConditions = conditions.condition;
            if (conditions.page) actualParams['paged'] = conditions.page;
            for (const item of conditions.set || []) {
                actualParams[item.label] = item.value;
            }
        } else {
            actualConditions = [];
        }
        const params = paramsConditionBuilder(actualConditions, new HttpParams({ fromObject: actualParams }));
        return this.http.get<DtoObject<CoursePlanComment[]>>(this.api, { params });
    }
}
