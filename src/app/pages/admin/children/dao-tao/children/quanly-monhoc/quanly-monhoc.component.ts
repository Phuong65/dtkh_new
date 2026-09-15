import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { MatButton } from '@angular/material/button';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Course } from '@models/course';
import { DonVi } from '@models/danh-muc';
import { CourseService } from '@services/course.service';
import { DanhMucService } from '@services/danh-muc.service';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { Helper } from '@utilities/helper';
import { UserService } from '@services/user.service';
import { AppState } from '@models/app-state';
import { IctuPermissionControl } from '@models/ictu-base-model';
import { DataTableEvent, DataTableEventName, IctuDataTable2, IctuDataTablePaginatorInfo } from '@models/datatable';
import { DtoObject, IctuConditionParam, IctuQueryCondition } from '@models/dto';
import { IctuFormControl2 } from '@models/ictu-form-control';
import { IctuPaginatorComponent } from '@theme/components/ictu-paginator/ictu-paginator.component';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';

// Đánh giá chuẩn đầu ra (Bloom)
const CHUAN_DAU_RA = [
    { id: 1, label: 'Biết' },
    { id: 2, label: 'Hiểu' },
    { id: 3, label: 'Vận dụng' },
    { id: 4, label: 'Phân tích' },
    { id: 5, label: 'Đánh giá' },
    { id: 6, label: 'Sáng tạo' }
];

// Hình thức thi
const EXAMFORMAT = [
    { id: 'et_1', key: 'TRACNGHIEM', label: 'Trắc nghiệm' },
    { id: 'et_2', key: 'THUCHANH', label: 'Thực hành' },
    { id: 'et_3', key: 'THUCHANH', label: 'Tự luận' },
    { id: 'et_4', key: 'THUCHANH', label: 'Vấn đáp' },
    { id: 'et_5', key: 'THUCHANH', label: 'Vẽ' },
    { id: 'et_6', key: 'DUAN', label: 'Đồ án' },
    { id: 'et_7', key: 'DUAN', label: 'Dự án' },
    { id: 'et_8', key: 'DUAN', label: 'Báo cáo' },
    { id: 'et_9', key: 'DUAN', label: 'Tiểu luận' }
];

export interface CourseManagementTab {
    key: string;
    label: string;
    icon: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-quanly-monhoc',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Drawer,
        InputText,
        Select,
        NgxEditorModule,
        MatButton,
        MatTooltipModule,
        IctuPaginatorComponent,
        LoadingProgressComponent
    ], 
    templateUrl: './quanly-monhoc.component.html',
    styleUrl: './quanly-monhoc.component.css'
})
export default class QuanLyMonhocComponent implements OnInit, OnDestroy {

    private readonly fb = inject(FormBuilder);
    private readonly courseService = inject(CourseService);
    private readonly userService = inject(UserService);
    private readonly danhMucService = inject(DanhMucService);
    private readonly auth = inject(AuthenticationService);
    private readonly notification = inject(NotificationService);
    private readonly router = inject(Router);

    private readonly destroy$ = new Subject<void>();

    readonly permissionControl = new IctuPermissionControl(this.auth.getUserPermission('quanly-monhoc'));

    readonly state: WritableSignal<AppState> = signal<AppState>('loading');

    readonly drawer: Signal<Drawer> = viewChild<Drawer>('pDrawer');
    readonly descEditor = new Editor();

    readonly dataTable: IctuDataTable2<Course> = new IctuDataTable2<Course>({
        rows: 20,
        pageLinkSize: 5
    });

    readonly khoaList: WritableSignal<DonVi[]> = signal<DonVi[]>([]);

    readonly formControl: IctuFormControl2<Course> = new IctuFormControl2<Course>({
        dropdownFields: [],
        formGroup: this.fb.group({
            title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
            maso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            category_ids: [null, [Validators.required]],
            nganh_bomon_id: [null],
            slug: [''],
            desc: [''],
            yeucau_sinhvien: [''],
            tailieu_chinh: [[]],
            tailieu_thamkhao: [[]],
            status: [1, Validators.required]
        }),
        objectName: 'môn học',
        drawer: this.drawer
    });

    // === Tab state & methods (màn hình 2) ===
    readonly tabs: CourseManagementTab[] = [
        { key: 'info', label: 'Thông tin', icon: 'fa-circle-info' },
        { key: 'outcomes', label: 'Mục tiêu - CĐR', icon: 'fa-bullseye' },
        { key: 'content', label: 'Nội dung', icon: 'fa-book-open' },
        { key: 'questions', label: 'CĐR - Câu hỏi', icon: 'fa-list-check' },
        { key: 'assessment', label: 'Kiểm tra - Đánh giá', icon: 'fa-clipboard-check' },
        { key: 'exam-form', label: 'Form đề', icon: 'fa-file-lines' },
        { key: 'settings', label: 'Cấu hình', icon: 'fa-gear' }
    ];

    activeTabKey: string = 'info';
    selectedCourseId: number | null = null;

    get activeTabLabel(): string {
        return this.tabs.find(tab => tab.key === this.activeTabKey)?.label || '';
    }

    selectTab(tab: CourseManagementTab): void {
        if (!tab.disabled) {
            this.activeTabKey = tab.key;
        }
    }

    selectCourse(courseId: number): void {
        this.router.navigate(['/course-detail', courseId, 'info'], {
            queryParams: { code: courseId }
        });
    }
    // =========================================================

    _search: string = '';
    private _temp: IctuDataTablePaginatorInfo = { paged: 1, resetPaginator: true };

    private readonly handleEvent: Record<DataTableEventName, (data: Course) => void> = {
        OPEN_FORM_ADD: () => {
            if (this.permissionControl.canCreate) {
                this.addForm();
            }
        },
        OPEN_FORM_UPDATE: (data: Course) => {
            if (this.permissionControl.canUpdate) {
                this.editForm(data);
            }
        },
        DELETE_SINGLE_ROW: (data: Course) => {
            if (this.permissionControl.canDelete) {
                this.deleteRow(data);
            }
        },
        DELETE_SELECTED_ROWS: () => {
            if (this.permissionControl.canDelete) {
                this.deleteSelectedRows();
            }
        },
        SUBMIT_FORM: () => this.submitForm()
    };

    get f(): FormGroup {
        return this.formControl.formGroup;
    }

    constructor() {
        this.eventObserver$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(({ name, data }: DataTableEvent<Course>) => this.handleEvent[name](data));
    }

    private readonly eventObserver$: Subject<DataTableEvent<Course>> = new Subject<DataTableEvent<Course>>();

    ngOnInit(): void {
        this.loadKhoaList();
        this.loadData(1, true);
    }

    ngOnDestroy(): void {
        this.descEditor.destroy();
        this.destroy$.next();
        this.destroy$.complete();
    }

    private formatCourseDisplay(course: Course): void {
        if (course.params) {
            course.sotinchi = course.params.sotinchi ?? undefined;
            if (course.params.exam_type) {
                const idx = EXAMFORMAT.findIndex(e => e.id === course.params.exam_type);
                course.hinhthucthi = idx !== -1 ? EXAMFORMAT[idx].label : undefined;
            } else if (course.params.exam_format) {
                const idx = EXAMFORMAT.findIndex(e => e.key === course.params.exam_format);
                course.hinhthucthi = idx !== -1 ? EXAMFORMAT[idx].label : undefined;
            }
            if (course.params.cdr) {
                const idx = CHUAN_DAU_RA.findIndex(e => e.id === course.params.cdr);
                course.chuandaura = idx !== -1 ? CHUAN_DAU_RA[idx].label : undefined;
            }
        }
    }

    loadKhoaList(): void {
        const userDonviId = this.auth.user?.donvi_id;
        if (!userDonviId) {
            this.khoaList.set([]);
            return;
        }
        this.danhMucService.getDonViList(userDonviId).subscribe({
            next: (list: DonVi[]) => this.khoaList.set(list),
            error: () => this.notification.toastError('Không tải được danh sách khoa')
        });
    }

    loadData(paged: number = 1, resetPaginator: boolean = true): void {
        if (!this.permissionControl.canView) {
            this.state.set('success');
            return;
        }
        this.state.set('loading');
        this._temp = { paged, resetPaginator };
        const conditions: IctuConditionParam[] = [
            { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-1' }
        ];
        const keyword: string = this._search.trim();
        if (keyword) {
            conditions.push({
                conditionName: 'title',
                condition: IctuQueryCondition.like,
                value: `%${keyword}%`
            });
        }
        this.courseService.loadCourses('', paged, this.dataTable.paginator.rows(), conditions).pipe(
            switchMap((res: DtoObject<Course[]>) => {
                const courses: Course[] = res.data || [];
                courses.forEach((course: Course): void => this.formatCourseDisplay(course));

                const creatorIds: number[] = [...new Set(
                    courses
                        .map((course: Course): number | null | undefined => course.creator_plan_id)
                        .filter((id: number | null | undefined): id is number => typeof id === 'number')
                )];
                if (!creatorIds.length) {
                    return of(res);
                }

                return this.userService.listByIds(creatorIds).pipe(
                    map(users => {
                        const userMap = new Map(users.map(user => [user.id, user.display_name]));
                        courses.forEach((course: Course): void => {
                            course.editor_name = course.creator_plan_id
                                ? userMap.get(course.creator_plan_id) || 'Chưa phân quyền'
                                : 'Chưa phân quyền';
                        });
                        return res;
                    })
                );
            })
        ).subscribe({
            next: (res: DtoObject<Course[]>) => {
                this.dataTable.fillRawData(res, { paged, resetPaginator });
                this.state.set('success');
            },
            error: () => {
                this.state.set('error');
                this.notification.toastError('Không tải được danh sách môn học');
            }
        });
    }

    reload(event?: Event): void {
        event?.preventDefault();
        this.loadData(1, true);
    }

    onSearchData(): void {
        this.loadData(1, true);
    }

    onChangePage(paged: number): void {
        this.loadData(paged, false);
    }

    addNewItem(): void {
        if (!this.permissionControl.canCreate) {
            this.notification.toastWarning('Bạn không có quyền thêm môn học');
            return;
        }
        this.eventObserver$.next({ name: 'OPEN_FORM_ADD', data: null });
    }

    editRow(row: Course): void {
        if (!this.permissionControl.canUpdate) {
            this.notification.toastWarning('Bạn không có quyền sửa môn học');
            return;
        }
        this.eventObserver$.next({ name: 'OPEN_FORM_UPDATE', data: row });
    }

    addForm(): void {
        if (!this.permissionControl.canCreate) {
            this.notification.toastWarning('Bạn không có quyền thêm môn học');
            return;
        }
        this.f.reset({
            title: '',
            maso: '',
            category_ids: null,
            nganh_bomon_id: null,
            slug: '',
            desc: '',
            yeucau_sinhvien: '',
            tailieu_chinh: [],
            tailieu_thamkhao: [],
            status: 1
        });
        this.formControl.openFormAdd();
    }

    private decodeHtmlEntities(str: string): string {
        if (!str) return '';
        try {
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            let val = txt.value;
            if (val.includes('&lt;') || val.includes('&gt;')) {
                txt.innerHTML = val;
                val = txt.value;
            }
            return val;
        } catch {
            return Helper.decodeHTML(str);
        }
    }

    editForm(row: Course): void {
        if (!this.permissionControl.canUpdate) {
            this.notification.toastWarning('Bạn không có quyền sửa môn học');
            return;
        }
        this.f.reset({
            title: row.title || '',
            maso: row.maso || '',
            category_ids: row.category_ids ?? null,
            nganh_bomon_id: row.nganh_bomon_id ?? null,
            slug: row.slug || '',
            desc: this.decodeHtmlEntities(row.desc || ''),
            yeucau_sinhvien: row.yeucau_sinhvien || '',
            tailieu_chinh: row.tailieu_chinh || [],
            tailieu_thamkhao: row.tailieu_thamkhao || [],
            status: row.status ?? 1
        });
        this.formControl.openFormEdit(row);
    }

    deleteRow(row: Course): void {
        if (!this.permissionControl.canDelete) {
            this.notification.toastWarning('Bạn không có quyền xóa môn học');
            return;
        }
        this.notification.confirmDelete(1).pipe(
            takeUntil(this.destroy$)
        ).subscribe((confirmed: boolean) => {
            if (!confirmed) {
                return;
            }
            this.courseService.delete(row.id).pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: () => {
                    this.notification.toastSuccess('Xóa môn học thành công');
                    this.loadData(this._temp.paged, false);
                },
                error: () => this.notification.toastError('Xóa môn học thất bại')
            });
        });
    }

    deleteSelectedRows(): void {
        if (!this.permissionControl.canDelete) {
            this.notification.toastWarning('Bạn không có quyền xóa môn học');
            return;
        }
        const selected: Course[] = this.dataTable.getSelectedData();
        if (!selected.length) {
            return;
        }
        this.notification.confirmDelete(selected.length).pipe(
            takeUntil(this.destroy$)
        ).subscribe((confirmed: boolean) => {
            if (!confirmed) {
                return;
            }
            const requests: Observable<any>[] = selected.map((d: Course) => this.courseService.delete(d.id));
            forkJoin(requests).pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: () => {
                    this.notification.toastSuccess(`Xóa thành công ${selected.length} môn học`);
                    this.loadData(1, true);
                },
                error: () => this.notification.toastError('Xóa danh sách môn học thất bại')
            });
        });
    }

    async submitForm(): Promise<void> {
        const isFormAdd = this.formControl.isFormAdd;
        if (isFormAdd && !this.permissionControl.canCreate) {
            this.notification.toastWarning('Bạn không có quyền thêm môn học');
            return;
        }
        if (!isFormAdd && !this.permissionControl.canUpdate) {
            this.notification.toastWarning('Bạn không có quyền cập nhật môn học');
            return;
        }
        if (this.f.invalid) {
            this.f.markAllAsTouched();
            this.notification.toastWarning('Vui lòng kiểm tra lại thông tin');
            return;
        }

        const value = this.f.getRawValue();
        const maso = (value.maso || '').trim();
        if (!maso) {
            this.notification.toastWarning('Mã môn học không được để trống');
            return;
        }

        // Kiểm tra trùng mã
        const exists = await this.courseService.checkMasoExists(maso, isFormAdd ? undefined : this.formControl.object?.id).toPromise();
        if (exists) {
            this.notification.toastWarning('Mã môn học đã tồn tại, vui lòng dùng mã khác');
            return;
        }

        const payload = this.courseService.padCoursePayload(value);

        const operation$ = isFormAdd
            ? this.courseService.create(payload)
            : this.courseService.update(this.formControl.object.id, payload);

        this.formControl.submit(operation$).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: () => {
                this.notification.toastSuccess(isFormAdd ? 'Thêm môn học thành công' : 'Cập nhật môn học thành công');
                this.formControl.closeForm();
                this.loadData(this._temp.paged, isFormAdd);
            },
            error: () => this.notification.toastError(isFormAdd ? 'Thêm môn học thất bại' : 'Cập nhật môn học thất bại')
        });
    }
}