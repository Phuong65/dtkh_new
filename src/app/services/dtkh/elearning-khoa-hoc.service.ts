import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Dto, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { ElnKhoaHoc } from '@models/dtkh/elng-khoa-hoc';
import { paramsConditionBuilder } from '@utilities/helper';
import { getApiRouteLink } from '@env';

export interface ConditionOption {
    condition: IctuConditionParam[];
    set: { label: string; value: string }[];
    page: string | null;
}

@Injectable({ providedIn: 'root' })
export class ElnKhoaHocService {

    private readonly http: HttpClient = inject(HttpClient);

    private readonly api: string = getApiRouteLink('courses/');

    addElnKhoaHoc(data: unknown): Observable<unknown> {
        return this.http.post<Dto>(this.api, data).pipe(map((res: Dto) => res.data));
    }

    updateElnKhoaHoc(id: number, data: unknown): Observable<unknown> {
        return this.http.put<Dto>(this.api.concat(id.toString()), data).pipe(map((res: Dto) => res.data));
    }

    deleteElnKhoaHoc(id: number): Observable<unknown> {
        return this.http.delete<Dto>(this.api.concat(id.toString())).pipe(map((res: Dto) => res.data));
    }

    getKhoaHocByPageNew_2(option: ConditionOption): Observable<{ data: ElnKhoaHoc[]; recordsFiltered: number }> {
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

    getTotalnghiemthuCauhoi(option: ConditionOption): Observable<ElnKhoaHoc[]> {
        let filter: HttpParams = option.page
            ? paramsConditionBuilder(option.condition).set('paged', option.page)
            : paramsConditionBuilder(option.condition);
        if (option.set?.length) {
            option.set.forEach((s: { label: string; value: string }): void => {
                filter = filter.set(s.label, s.value);
            });
        }
        return this.http.get<Dto>(this.api + 'nghiemthu-tracnghiem', { params: filter }).pipe(map((res: Dto) => res.data));
    }

    getTotalQuestion(option: unknown): Observable<ElnKhoaHoc[]> {
        return this.http.get<Dto>(this.api + 'total-questions', { params: option as Record<string, string> }).pipe(map((res: Dto) => res.data));
    }

    query<T>(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<T[]> {
        const params: HttpParams = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams }));
        return this.http.get<Dto>(this.api, { params }).pipe(map((res: Dto) => res.data));
    }
}
