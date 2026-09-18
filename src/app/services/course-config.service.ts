import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dto } from '@models/dto';
import { CourseConfig } from '@models/dtkh/course-config';
import { ConditionOption } from '@models/condition-option';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({
    providedIn: 'root'
})
export class CourseConfigService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('course-config/');

    addCourseConfig(data: Partial<CourseConfig>): Observable<any> {
        return this.http.post<Dto>(this.api, data).pipe(map(res => res.data));
    }

    updateCourseConfig(id: number, data: Partial<CourseConfig>): Observable<any> {
        return this.http.put<Dto>(`${this.api}${id}`, data).pipe(map(res => res.data));
    }

    deleteCourseConfig(id: number): Observable<any> {
        return this.http.delete<Dto>(`${this.api}${id}`).pipe(map(res => res.data));
    }

    getCourseConfigByPageNew(option: ConditionOption): Observable<{ data: CourseConfig[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) {
            params = params.set('paged', option.page);
        }
        for (const item of option.set || []) {
            params = params.set(item.label, item.value);
        }
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: (res.data || []) as CourseConfig[], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }
}
