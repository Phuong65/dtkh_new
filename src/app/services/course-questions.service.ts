import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CourseQuestions } from '@models/dtkh/course-questions';
import { Dto } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CourseQuestionsService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('course-questions/');

    addCourseQuestions(data: Partial<CourseQuestions>): Observable<number> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCourseQuestions(id: number, data: Partial<CourseQuestions>): Observable<unknown> {
        return this.http.put<Dto>(`${this.api}${id}`, data).pipe(map(res => res.data));
    }

    deleteCourseQuestions(id: number): Observable<unknown> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    getCourseQuestionsByPageNew(option: ConditionOption): Observable<{ data: CourseQuestions[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) params = params.set('paged', option.page);
        for (const item of option.set || []) params = params.set(item.label, item.value);
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CourseQuestions[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }

    deleteCourseQuestionsBy(col: string, item: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.delete<Dto>(`${this.api}${item}`, { params }).pipe(map(res => res.data));
    }

    updateCourseQuestionsByCol(id: number, data: Partial<CourseQuestions>, col: string): Observable<unknown> {
        const params = new HttpParams().set('by', col);
        return this.http.put<Dto>(`${this.api}${id}`, data, { params }).pipe(map(res => res.data));
    }
}
