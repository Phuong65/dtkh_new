import { Injectable } from '@angular/core';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';
import { Course } from '@models/course';
import { map, Observable } from 'rxjs';
import { Dto, DtoObject, IctuConditionParam, IctuQueryCondition, IctuQueryParams } from '@models/dto';

@Injectable({
    providedIn: 'root'
})
export class CourseService extends IctuBaseServiceClass<Course> {
    constructor() {
        super('courses');
    }

    loadCourses(search: string = '', paged: number = 1, limit: number = 20, conditions: IctuConditionParam[] = []): Observable<DtoObject<Course[]>> {
        const queryParams: IctuQueryParams = {
            paged,
            limit,
            orderby: 'title',
            order: 'ASC'
        };
        const allConditions = [...conditions];
        if (search) {
            allConditions.push({
                conditionName: 'title',
                condition: IctuQueryCondition.like,
                value: `%${search}%`
            });
        }
        return this.query(allConditions, queryParams);
    }

    /**
     * Kiểm tra mã môn đã tồn tại hay chưa.
     * excludeId dùng khi sửa để bỏ qua chính bản ghi đang sửa.
     */
    checkMasoExists(maso: string, excludeId?: number): Observable<boolean> {
        const conditions: IctuConditionParam[] = [
            { conditionName: 'maso', condition: IctuQueryCondition.equal, value: maso }
        ];
        if (excludeId !== undefined && excludeId !== null) {
            conditions.push({ conditionName: 'id', condition: IctuQueryCondition.notEqual, value: excludeId.toString(10) });
        }
        return this.query(conditions, { limit: 1, select: 'id' }).pipe(
            map((response: DtoObject<Course[]>): boolean => (response.data || []).length > 0)
        );
    }

    /**
     * Tìm khoa quản lý (category) của một môn học theo id.
     */
    getCourseById(id: number): Observable<Course> {
        return this.get(id);
    }

    /**
     * Chuẩn hóa payload trước khi gửi lên API.
     */
    padCoursePayload(info: Partial<Course>): Partial<Course> {
        const payload: Partial<Course> = { ...info };
        if (typeof payload.maso === 'string') {
            payload.maso = payload.maso.trim();
        }
        if (typeof payload.title === 'string') {
            payload.title = payload.title.trim();
        }
        return payload;
    }

    /**
     * Số bản ghi đang dùng một mã môn (phục vụ kiểm tra trùng).
     */
    countByMaso(maso: string): Observable<number> {
        return this.query([{ conditionName: 'maso', condition: IctuQueryCondition.equal, value: maso }], { limit: 1 }).pipe(
            map((response: Dto): number => response.recordsFiltered ?? response.recordsTotal ?? (response.data || []).length)
        );
    }
}