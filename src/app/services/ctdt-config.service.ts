import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DtoObject, IctuConditionParam, IctuQueryParams } from '@models/dto';
import { CtdtConfig } from '@models/dtkh/ctdt-config';
import { getApiRouteLink } from '@env';
import { paramsConditionBuilder } from '@utilities/helper';

@Injectable({ providedIn: 'root' })
export class CtdtConfigService {
    private readonly http = inject(HttpClient);
    private readonly api = getApiRouteLink('ctdt-config/');

    getCtdtConfigByPageNew(conditions: IctuConditionParam[], queryParams?: IctuQueryParams): Observable<DtoObject<CtdtConfig[]>> {
        const params = paramsConditionBuilder(conditions, new HttpParams({ fromObject: queryParams || {} }));
        return this.http.get<DtoObject<CtdtConfig[]>>(this.api, { params });
    }
}
