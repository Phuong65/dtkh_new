import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, WritableSignal } from '@angular/core';
import { AppState } from '@models/app-state';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { Course } from '@models/course';
import { DonVi, NganhBomon } from '@models/danh-muc';
import { Ctdt } from '@models/dtkh/ctdt';
import { CtdtConfig } from '@models/dtkh/ctdt-config';
import { CtdtHocphan } from '@models/dtkh/ctdt_hocphan';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { IctuConditionParam, IctuQueryCondition } from '@models/dto';
import { UserProfile } from '@models/user-profile';
import { AuthenticationService } from '@services/authentication.service';
import { CourseService } from '@services/course.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CtdtConfigService } from '@services/ctdt-config.service';
import { CtdtHocphanService } from '@services/ctdt-hocphan.service';
import { CtdtService } from '@services/ctdt.service';
import { DanhMucService } from '@services/danh-muc.service';
import { NotificationService } from '@services/notification.service';
import { UserProfileService } from '@services/user-profile.service';
import { IctuEditorComponent } from '@theme/components/ictu-editor/ictu-editor.component';
import { FormDocumentFileAndLinkComponent } from '@components/form-document-file-and-link/form-document-file-and-link.component';
import { Helper } from '@utilities/helper';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

const CHUAN_DAU_RA = [
    { id: 1, label: 'Biết' }, { id: 2, label: 'Hiểu' }, { id: 3, label: 'Vận dụng' },
    { id: 4, label: 'Phân tích' }, { id: 5, label: 'Đánh giá' }, { id: 6, label: 'Sáng tạo' }
];

const EXAM_FORMAT = [
    { id: 'et_1', key: 'TRACNGHIEM', label: 'Trắc nghiệm' }, { id: 'et_2', key: 'THUCHANH', label: 'Thực hành' },
    { id: 'et_3', key: 'THUCHANH', label: 'Tự luận' }, { id: 'et_4', key: 'THUCHANH', label: 'Vấn đáp' },
    { id: 'et_5', key: 'THUCHANH', label: 'Vẽ' }, { id: 'et_6', key: 'DUAN', label: 'Đồ án' },
    { id: 'et_7', key: 'DUAN', label: 'Dự án' }, { id: 'et_8', key: 'DUAN', label: 'Báo cáo' },
    { id: 'et_9', key: 'DUAN', label: 'Tiểu luận' }
];
const DINH_DANG_BAI_TRAC_NGHIEM = [
    { key: 1, label: 'Form 1 - Ngoại ngữ' }, { key: 2, label: 'Form 2 - Toán' }, { key: 0, label: 'Các môn khác' }
];

interface CtdtGroup {
    label: string;
    value: number;
    items: { label: string; value: string; parent_id: number }[];
    select_item?: string | null;
    hocky?: number | null;
    hp_hoctruoc?: number[];
    hp_tienquyet?: number[];
    hp_songhanh?: number[];
}
type RegularTestType = 'THUONGXUYEN_TRACNGHIEM' | 'THUONGXUYEN_TULUAN' | 'THUONGXUYEN_DUAN';

@Component({
    selector: 'app-monhoc-thongtin',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputText, IctuEditorComponent, FormDocumentFileAndLinkComponent, MultiSelect, Select, MatButton, MatTooltip, LoadingProgressComponent],
    templateUrl: './monhoc-thongtin.component.html',
    styleUrl: './monhoc-thongtin.component.css'
})
export class MonhocThongtinComponent implements OnInit, OnChanges, OnDestroy {
    @Input() course: Course | null = null;
    @Input() courseId = 0;

    readonly formKhoaHoc: FormGroup;
    readonly state: WritableSignal<AppState> = signal<AppState>('loading');
    readonly chuandaura = CHUAN_DAU_RA;
    readonly EXAMFORMAT = EXAM_FORMAT;
    readonly DINHDANG_BAITRACNGHIEM = DINH_DANG_BAI_TRAC_NGHIEM;
    readonly key_server = 'ictu';
    selectedCourse: Course | null = null;
    list_nganh_bomon: NganhBomon[] = [];
    list_donvi_chuyenmon: DonVi[] = [];
    list_plan: CoursePlanActivities[] = [];
    list_test_thuongxuyen: CoursePlanActivities[] = [];
    group_ctdt: CtdtGroup[] = [];
    selectCtdts: CtdtGroup[] = [];
    selectedCtdtsId: number[] = [];
    slugIsValid = true;
    isManager = false;
    isLanhDaoKhoa = false;
    isLanhDaoBomon = false;
    routerDaotao = false;
    routerAdmin = false;
    routerLanhdaokhoa = false;
    routerGiangvien = false;
    routerLanhdaobomon = false;
    userId = 0;
    isSaving = false;
    private readonly destroy$ = new Subject<void>();
    private initializedCourseId = 0;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly courseService: CourseService,
        private readonly auth: AuthenticationService,
        private readonly profileService: UserProfileService,
        private readonly notificationService: NotificationService,
        private readonly danhMucService: DanhMucService,
        private readonly planService: CoursePlanActivitiesService,
        private readonly ctdtService: CtdtService,
        private readonly ctdtConfigService: CtdtConfigService,
        private readonly ctdtHocphanService: CtdtHocphanService,
        formBuilder: FormBuilder
    ) {
        this.formKhoaHoc = formBuilder.group({
            title: ['', Validators.required], maso: ['', Validators.required], category_ids: [null, Validators.required], nganh_bomon_id: [null],
            slug: [''], desc: [''], yeucau_sinhvien: [''], tailieu_chinh: [[]], tailieu_thamkhao: [[]], sotinchi: [null, Validators.required],
            exam_format: [''], cdr: [null], sotinchi_th: [0, Validators.required], exam_type: [null], tongsogio: [null], lythuyet: [null],
            thaoluan_baitap: [null], th_thinghiem: [null], kiemtra_dinhky: [null], tuhoc: [null], av: [null]
        });
        this.setupPermissions();
    }

    get f() { return this.formKhoaHoc.controls; }

    ngOnInit(): void {
        const id = this.course?.id || this.courseId || Number(this.route.snapshot.queryParamMap.get('code'));
        if (id && id !== this.initializedCourseId) {
            this.initializeCourse(id, this.course?.id === id ? this.course : undefined);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const incoming = changes['course']?.currentValue as Course | null;
        if (incoming?.id && incoming.id !== this.initializedCourseId) this.initializeCourse(incoming.id, incoming);
    }

    ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

    private setupPermissions(): void {
        const roles = this.auth.roles.map(role => String(role.name));
        this.userId = this.auth.user?.id || 0;
        this.isManager = roles.some(role => ['truong_ld', 'admin', 'administrator', 'daotao_troly', 'daotao_ld'].includes(role));
        this.isLanhDaoKhoa = roles.includes('khoa_ld');
        this.isLanhDaoBomon = roles.includes('bomon_ld');
        this.routerAdmin = roles.some(role => ['admin', 'administrator', 'truong_ld'].includes(role));
        this.routerDaotao = roles.some(role => ['daotao_ld', 'daotao_troly'].includes(role));
        this.routerLanhdaokhoa = this.isLanhDaoKhoa;
        this.routerLanhdaobomon = this.isLanhDaoBomon;
        this.routerGiangvien = roles.includes('teacher');
    }

    private initializeCourse(id: number, supplied?: Course): void {
        if (!id) { void this.router.navigate(['/admin/content-none']); return; }
        this.initializedCourseId = id;
        this.state.set('loading');
        this.notificationService.isProcessing(true);
        const course$ = supplied ? new Observable<Course>(subscriber => { subscriber.next(supplied); subscriber.complete(); }) : this.courseService.getCourseById(id);
        const profileConditions: IctuConditionParam[] = [{ conditionName: 'user_id', condition: IctuQueryCondition.equal, value: String(this.userId) }];
        const configConditions: IctuConditionParam[] = [{ conditionName: 'GROUP', condition: IctuQueryCondition.equal, value: 'KHOI_KIEN_THUC' }];
        const planConditions: IctuConditionParam[] = [{ conditionName: 'course_id', condition: IctuQueryCondition.equal, value: String(id) }];
        forkJoin({
            course: course$, profiles: this.profileService.query(profileConditions, { limit: 1 }),
            donvi: this.danhMucService.getDonViList(this.auth.user?.donvi_id), bomon: this.danhMucService.getNganhBomonList('bomon'),
            ctdt: this.ctdtService.getCtdtByPageNew([], { limit: -1 }), configs: this.ctdtConfigService.getCtdtConfigByPageNew(configConditions, { limit: -1 }),
            plans: this.planService.getCoursePlanActivitiesByPageNew({ condition: planConditions, set: [{ label: 'limit', value: '-1' }], page: null })
        }).pipe(takeUntil(this.destroy$)).subscribe({
            next: result => {
                if (!this.canAccess(result.course, result.profiles.data || [])) {
                    this.state.set('error');
                    return;
                }
                this.selectedCourse = result.course;
                this.list_donvi_chuyenmon = result.donvi; this.list_nganh_bomon = result.bomon; this.list_plan = result.plans.data || [];
                this.group_ctdt = this.buildCtdtGroups(result.ctdt.data || [], result.configs.data || []); this.fillForm(result.course);
                void this.loadSelectedCtdt(id); this.notificationService.isProcessing(false);
                this.state.set('success');
            }, error: () => this.handleLoadError()
        });
    }

    private canAccess(course: Course, profiles: UserProfile[]): boolean {
        // `/course-detail/:id` is the new shared detail route. Its route guard and
        // list permission already authorize the record; legacy router scope checks
        // would reject valid records because this route has no legacy router prefix.
        return Boolean(course?.id);
    }

    private denyAccess(): false { this.notificationService.isProcessing(false); this.notificationService.toastError('Không tìm thấy môn học'); void this.router.navigate(['/admin/content-none']); return false; }

    private buildCtdtGroups(ctdts: Ctdt[], configs: CtdtConfig[]): CtdtGroup[] {
        const fallback = this.auth.getConfigParams<{ title: string; key: string }[]>('KHOI_KIEN_THUC', []);
        return ctdts.map(ctdt => { const id = ctdt.id || 0; const children = configs.filter(config => config.ctdt_id === id); const source = children.length ? children : fallback;
            return { label: ctdt.ten, value: id, items: source.map(item => ({ label: item.title, value: item.key, parent_id: id })), select_item: null, hocky: null }; });
    }

    private async loadSelectedCtdt(courseId: number): Promise<void> {
        try {
            const conditions: IctuConditionParam[] = [{ conditionName: 'course_id', condition: IctuQueryCondition.equal, value: String(courseId) }];
            const response = await firstValueFrom(this.ctdtHocphanService.getCtdtHocphanByPageNew(conditions, { limit: -1 }));
            this.selectedCtdtsId = []; this.selectCtdts = [];
            for (const item of response.data || []) { const group = this.group_ctdt.find(candidate => candidate.value === item.ctdt_id); if (!group) continue;
                group.select_item = item.khoikienthuc; group.hocky = item.hocky; group.hp_hoctruoc = item.hp_hoctruoc; group.hp_songhanh = item.hp_songhanh; group.hp_tienquyet = item.hp_tienquyet;
                this.selectedCtdtsId.push(group.value); this.selectCtdts.push(group); }
        } catch { this.notificationService.toastError('Không tải được học phần thuộc chương trình đào tạo'); }
    }

    private fillForm(course: Course): void {
        const params = course.params || {};
        this.formKhoaHoc.patchValue({ title: course.title, maso: course.maso, category_ids: course.category_ids ?? null, nganh_bomon_id: course.nganh_bomon_id ?? null,
            slug: course.slug || '', desc: this.decodeEditorHtml(course.desc) || '<p>1) Quy định về điểm:</p><p><br></p><p>2) Điều kiện dự thi:</p>',
            yeucau_sinhvien: this.decodeEditorHtml(course.yeucau_sinhvien),
            tailieu_chinh: course.tailieu_chinh || [], tailieu_thamkhao: course.tailieu_thamkhao || [], sotinchi: params.sotinchi ?? null, exam_format: params.exam_format || '', cdr: params.cdr ?? null,
            sotinchi_th: params.sotinchi_th ?? 0, exam_type: params.exam_type ?? null, tongsogio: params.tongsogio ?? null, lythuyet: params.lythuyet ?? null,
            thaoluan_baitap: params.thaoluan_baitap ?? null, th_thinghiem: params.th_thinghiem ?? null, kiemtra_dinhky: params.kiemtra_dinhky ?? null, tuhoc: params.tuhoc ?? null, av: course.av ?? null });
    }

    private decodeEditorHtml(value?: string | null): string {
        if (!value) return '';
        try {
            const textarea = document.createElement('textarea');
            let decoded = value;
            // API data may be HTML-encoded once or twice.
            for (let pass = 0; pass < 2; pass++) {
                textarea.innerHTML = decoded;
                const next = textarea.value;
                if (next === decoded) break;
                decoded = next;
            }
            return decoded;
        } catch {
            return Helper.decodeHTML(value);
        }
    }

    private handleLoadError(): void {
        this.notificationService.isProcessing(false);
        this.state.set('error');
        this.notificationService.toastError('Lỗi kết nối, vui lòng thử lại');
    }

    onChangeExam(event: string | { value?: string }): void { const value = typeof event === 'string' ? event : event?.value; const selected = this.EXAMFORMAT.find(item => item.id === value); if (selected) this.f['exam_format'].setValue(selected.key); }
    onChangeSelectCtdt(): void { this.selectCtdts = this.group_ctdt.filter(item => this.selectedCtdtsId.includes(item.value)); }
    filteredBomon(): NganhBomon[] { const categoryId = Number(this.f['category_ids'].value); return this.list_nganh_bomon.filter(item => !categoryId || item.donvi_chuyenmon_id === categoryId); }

    async onCheckMaHpPromise(): Promise<boolean | null> { if (!this.selectedCourse) return null; try { return !(await firstValueFrom(this.courseService.checkMasoExists(String(this.f['maso'].value || '').trim(), this.selectedCourse.id))); } catch { return null; } }

    async addCtdtHocPhan(course: Partial<Course>): Promise<boolean> {
        if (!this.selectedCourse) return false;
        const index = this.list_donvi_chuyenmon.findIndex(item => item.id === course.category_ids);
        await firstValueFrom(this.ctdtHocphanService.deleteCtdtHocphanByCol(this.selectedCourse.id, 'course_id'));
        if (!this.selectCtdts.length) return true;
        const requests = this.selectCtdts.map(item => this.ctdtHocphanService.addCtdtHocphan({ course_id: this.selectedCourse?.id || 0, course_name: course.title || '', khoikienthuc: item.select_item || '',
            sotinchi: course.params?.sotinchi || 0, sotinchi_thuchanh: course.params?.sotinchi_th || 0, hocky: item.hocky || 0, category_title: index !== -1 ? this.list_donvi_chuyenmon[index].title : '',
            status: 1, category_id: course.category_ids || 0, ctdt_id: item.value, hp_hoctruoc: item.hp_hoctruoc, hp_tienquyet: item.hp_tienquyet, hp_songhanh: item.hp_songhanh, ordering: 100 }));
        await firstValueFrom(forkJoin(requests)); return true;
    }

    async saveCourse(): Promise<void> {
        if (!this.selectedCourse || !(this.routerDaotao || this.routerAdmin || this.routerLanhdaokhoa || this.routerLanhdaobomon)) { this.notificationService.toastWarning('Bạn không có quyền cập nhật môn học'); return; }
        if (this.formKhoaHoc.invalid) { this.formKhoaHoc.markAllAsTouched(); this.notificationService.toastError('Thông tin nhập vào chưa đúng, vui lòng kiểm tra lại', 'Lỗi nhập liệu'); return; }
        this.isSaving = true;
        this.state.set('loading');
        this.notificationService.isProcessing(true);
        try {
            const validCode = await this.onCheckMaHpPromise(); if (validCode === null) throw new Error('check-code-failed'); if (!validCode) { this.notificationService.toastWarning('Mã học phần đã tồn tại, vui lòng thử lại'); return; }
            if (this.selectCtdts.some(item => !item.select_item)) { this.notificationService.toastWarning('Vui lòng chọn Khối kiến thức cho môn học ở Chương trình đào tạo'); return; }
            const form = this.formKhoaHoc.getRawValue();
            const tailieuChinh = this.normalizeCourseDocuments(form.tailieu_chinh);
            const tailieuThamkhao = this.normalizeCourseDocuments(form.tailieu_thamkhao);
            const data: Partial<Course> = { title: form.title, maso: String(form.maso || '').trim(), slug: Helper.removeAccents(form.title), category_ids: form.category_ids, nganh_bomon_id: form.nganh_bomon_id,
                desc: form.desc, yeucau_sinhvien: form.yeucau_sinhvien, tailieu_chinh: tailieuChinh, tailieu_thamkhao: tailieuThamkhao, av: form.av,
                params: { sotinchi: form.sotinchi, exam_format: form.exam_format, cdr: form.cdr, sotinchi_th: form.sotinchi_th, exam_type: form.exam_type, tongsogio: form.tongsogio, lythuyet: form.lythuyet,
                    thaoluan_baitap: form.thaoluan_baitap, th_thinghiem: form.th_thinghiem, kiemtra_dinhky: form.kiemtra_dinhky, tuhoc: form.tuhoc } };
            await this.addCtdtHocPhan(data); await firstValueFrom(this.courseService.update(this.selectedCourse.id, this.courseService.padCoursePayload(data))); this.selectedCourse = { ...this.selectedCourse, ...data }; this.notificationService.toastSuccess('Sửa thông tin thành công');
            this.state.set('success');
        } catch {
            this.notificationService.toastError('Sửa thông tin thất bại');
            this.state.set('success');
        } finally {
            this.notificationService.isProcessing(false);
            this.isSaving = false;
            this.state.set('success');
        }
    }

    onDocumentsChange(field: 'tailieu_chinh' | 'tailieu_thamkhao', documents: unknown[]): void {
        this.formKhoaHoc.get(field)?.setValue(documents || []);
        this.formKhoaHoc.get(field)?.markAsDirty();
    }

    private normalizeCourseDocuments(value: unknown): any[] {
        if (!Array.isArray(value)) return [];
        return value.map((item: any, index: number) => {
            if (item?.type === 'file' || item?.type === 'link') {
                return {
                    ordering: item.ordering ?? index + 1,
                    type: item.type,
                    title: item.title || item.file?.title || item.file?.name || '',
                    link: item.link || '',
                    file: item.type === 'file' ? item.file : undefined
                };
            }
            return {
                ordering: index + 1,
                type: 'file',
                title: item?.title || item?.name || '',
                file: item
            };
        }).filter((item: any) => item.type === 'link' ? Boolean(item.title) : Boolean(item.file));
    }

    onChangeTypeTest(event: { key?: RegularTestType } | RegularTestType, test: CoursePlanActivities): void { const key = typeof event === 'string' ? event : event?.key; if (key) test.type = key; }
    createTestThuongxuyen(examFormat: string, credits: number): void { if (!credits || !examFormat) { this.notificationService.toastWarning('Vui lòng cài đặt số tín chỉ cho môn học'); return; } const type: RegularTestType = examFormat === 'DUAN' ? 'THUONGXUYEN_DUAN' : examFormat === 'TRACNGHIEM' ? 'THUONGXUYEN_TRACNGHIEM' : 'THUONGXUYEN_TULUAN'; this.createTestIctu(type, examFormat, credits); }
    createTestIctu(type: RegularTestType, examFormat: string, credits: number): void { this.list_test_thuongxuyen = this.buildRegularTests(type, examFormat, credits); }
    createTestHvu(type: RegularTestType, examFormat: string, credits: number): void { this.list_test_thuongxuyen = this.buildRegularTests(type, examFormat, Number(credits) > 2 ? 2 : 1); }

    private buildRegularTests(type: RegularTestType, examFormat: string, count: number): CoursePlanActivities[] {
        const plan = this.list_plan.find(item => item.week === 1000); const existing = (plan?.children || []).filter(item => item.ordering !== 0 && item.ordering !== 100).slice(0, count);
        for (let index = existing.length + 1; index <= count; index++) existing.push({ course_id: this.selectedCourse?.id || 0, week: 1000, title: `Bài kiểm tra thường xuyên ${index}`, desc: null, video: null, files: null, ordering: index, status: 1, course_lesson_id: 0, parent_id: plan?.id || null, type, desc_title: null, edit: 1, slides: null });
        if (examFormat === 'DUAN') { existing.unshift({ course_id: this.selectedCourse?.id || 0, week: 1000, title: 'Danh sách dự án', desc: null, video: null, files: null, ordering: 0, status: 1, course_lesson_id: 0, parent_id: plan?.id || null, type, desc_title: null, edit: 1, slides: null }); existing.push({ course_id: this.selectedCourse?.id || 0, week: 1000, title: 'Thi kết thúc học phần', desc: null, video: null, files: null, ordering: 100, status: 1, course_lesson_id: 0, parent_id: plan?.id || null, type, desc_title: null, edit: 1, slides: null }); }
        return existing;
    }
}
