import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConditionOption } from '@models/condition-option';
import { Dto } from '@models/dto';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({ providedIn: 'root' })
export class ClassesService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('class/');

    getClassesByPageNew(option: ConditionOption): Observable<{ data: any[]; recordsFiltered: number }> {
        let params = paramsConditionBuilder(option.condition);
        if (option.page) params = params.set('paged', option.page);
        for (const item of option.set || []) params = params.set(item.label, item.value);
        return this.http.get<Dto>(this.api, { params }).pipe(
            map(res => ({ data: Array.isArray(res.data) ? res.data : [], recordsFiltered: res.recordsFiltered || 0 }))
        );
    }
}