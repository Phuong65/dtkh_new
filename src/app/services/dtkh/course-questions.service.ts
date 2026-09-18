import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { Dto, IctuConditionParam, IctuQueryCondition, IctuQueryParams } from '@models/dto';
import { CourseQuestions } from '@models/dtkh/course-questions';
import { ConditionOption } from '@services/dtkh/elearning-khoa-hoc.service';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

@Injectable({ providedIn: 'root' })
export class CourseQuestionsService {

    private readonly http: HttpClient = inject(HttpClient);

    private readonly api: string = getApiRouteLink('course-questions/');

    addCourseQuestions(data: unknown): Observable<unknown> {
        return this.http.post<Dto>(this.api, data).pipe(map((res: Dto) => res.data));
    }

    updateCourseQuestions(id: number, data: unknown): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map((res: Dto) => res.data));
    }

    deleteCourseQuestions(ids: string): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(ids)).pipe(map((res: Dto) => res.data));
    }

    getCourseQuestionsByPageNew(option: ConditionOption): Observable<{ data: CourseQuestions[]; recordsFiltered: number }> {
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

    updateCourseQuestionsByCol(id: number | string, data: unknown, col: string): Observable<unknown> {
        const by: HttpParams = new HttpParams().set('by', col);
        return this.http.put<Dto>(this.api.concat(id.toString()), data, { params: by }).pipe(map((res: Dto) => res.data));
    }

    query<T>(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<T[]> {
        const params: HttpParams = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams }));
        return this.http.get<Dto>(this.api, { params }).pipe(map((res: Dto) => res.data));
    }

    resolveLatestQuestion(question: CourseQuestions): Observable<CourseQuestions> {
        if (!question?.id) {
            return of(question);
        }
        return this.resolveLatestQuestionById(question, new Set<number>());
    }

    private resolveLatestQuestionById(question: CourseQuestions, visited: Set<number>): Observable<CourseQuestions> {
        const questionId: number = Number(question.id);
        if (!questionId || visited.has(questionId)) {
            return of(question);
        }
        visited.add(questionId);
        return this.query<CourseQuestions>([
            { conditionName: 'question_root_id', condition: IctuQueryCondition.equal, value: questionId.toString() },
        ], { limit: -1, paged: 1, orderby: 'id', order: 'DESC' }).pipe(
            switchMap((clones: CourseQuestions[]) => {
                const latest: CourseQuestions | undefined = clones
                    .filter((c: CourseQuestions) => c?.id && !visited.has(Number(c.id)))
                    .sort((a: CourseQuestions, b: CourseQuestions) => Number(b.id) - Number(a.id))[0];
                return latest ? this.resolveLatestQuestionById(latest, visited) : of(question);
            }),
        );
    }

    promptAi(prompt: string): Observable<unknown> {
        return this.http.post<Dto>(this.api.concat('tao-cau-hoi-ai'), { prompt }).pipe(map((res: Dto) => res.data));
    }
}
