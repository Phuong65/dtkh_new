import { CommonModule } from '@angular/common';
import { Component, effect, input, signal, WritableSignal } from '@angular/core';
import { AppState } from '@models/app-state';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { IctuEditorComponent } from '@theme/components/ictu-editor/ictu-editor.component';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { forkJoin, of } from 'rxjs';
import { Course } from '@models/course';
import { CourseMuctieuChitiet } from '@models/dtkh/course-muctieu-chitiet';
import { CourseClo } from '@models/dtkh/course-clo';
import { Ctdt } from '@models/dtkh/ctdt';
import { CtdtCdr } from '@models/dtkh/ctdt-cdr';
import { IctuConditionParam, IctuQueryCondition } from '@models/dto';
import { CourseService } from '@services/course.service';
import { CourseMuctieuChitietService } from '@services/course-muctieu-chitiet.service';
import { CourseCloService } from '@services/course-clo.service';
import { CourseCloContributeService } from '@services/course-clo-contribute.service';
import { CtdtService } from '@services/ctdt.service';
import { CtdtCdrService } from '@services/ctdt-cdr.service';
import { CtdtHocphanService } from '@services/ctdt-hocphan.service';
import { NotificationService } from '@services/notification.service';
import { Helper } from '@utilities/helper';

interface CtdtCdrGroup extends CtdtCdr {
    items: CtdtCdr[];
}

interface CtdtWithCdr extends Ctdt {
    ctdt_cdr: CtdtCdrGroup[];
}

type CourseCloWithPi = CourseClo & Record<string, CtdtCdr[] | unknown>;

@Component({
    selector: 'app-monhoc-muctieu-cdr',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, TextareaModule, MatButtonModule, MatProgressBarModule, IctuEditorComponent, SafeHtmlPipe, LoadingProgressComponent],
    templateUrl: './monhoc-muctieu-cdr.component.html',
    styleUrl: './monhoc-muctieu-cdr.component.css'
})
export class MonhocMuctieuCdrComponent {
    readonly course = input<Course | null>(null);
    readonly courseId = input<number>(0);
    readonly state: WritableSignal<AppState> = signal<AppState>('loading');
    readonly saving = signal(false);

    selectedCourse: Course | null = null;
    list_course_muctieu: CourseMuctieuChitiet[] = [];
    list_course_clo: CourseCloWithPi[] = [];
    list_ctdt: CtdtWithCdr[] = [];
    selectedClo: CourseCloWithPi | null = null;
    selectedCtdt: CtdtWithCdr | null = null;
    selectedStates: Record<number, boolean> = {};
    showPiDialog = false;
    private loadedCourseId = 0;

    constructor(
        private readonly courseService: CourseService,
        private readonly muctieuService: CourseMuctieuChitietService,
        private readonly cloService: CourseCloService,
        private readonly contributeService: CourseCloContributeService,
        private readonly ctdtService: CtdtService,
        private readonly ctdtCdrService: CtdtCdrService,
        private readonly ctdtHocphanService: CtdtHocphanService,
        private readonly notification: NotificationService
    ) {
        effect(() => {
            const course = this.course();
            const id = course?.id || this.courseId();
            if (id && id !== this.loadedCourseId) {
                this.selectedCourse = course;
                this.loadedCourseId = id;
                this.loadData(id);
            }
        });
    }

    private get courseConditions(): IctuConditionParam[] {
        const id = this.selectedCourse?.id || this.courseId();
        return [{ conditionName: 'course_id', condition: IctuQueryCondition.equal, value: id.toString(10) }];
    }

    private loadData(courseId: number): void {
        this.state.set('loading');
        forkJoin({
            course: this.course() ? of(null) : this.courseService.getCourseById(courseId),
            muctieu: this.muctieuService.getCourseMuctieuChitietByPageNew(this.courseConditions, { limit: -1, order: 'ASC', orderby: 'ordering' }),
            clo: this.cloService.getCourseCloByPageNew(this.courseConditions, { limit: -1, order: 'ASC', orderby: 'ordering' }),
            hocphan: this.ctdtHocphanService.getCtdtHocphanByPageNew(this.courseConditions, { limit: -1 })
        }).subscribe({
            next: data => {
                this.selectedCourse = this.course() || data.course;
                this.list_course_muctieu = data.muctieu.data || [];
                this.list_course_clo = (data.clo.data || []) as CourseCloWithPi[];
                this.state.set('success');
                this.loadCtdtAndPi(data.hocphan.data || []);
            },
            error: () => {
                this.state.set('error');
                this.notification.toastError('Không thể tải dữ liệu mục tiêu - CĐR');
            }
        });
    }

    private loadCtdtAndPi(hocphans: { ctdt_id: number }[]): void {
        const ids = [...new Set(hocphans.map(item => item.ctdt_id))];
        if (!ids.length) {
            this.list_ctdt = [];
            this.state.set('success');
            return;
        }
        forkJoin({
            ctdt: this.ctdtService.getCtdtByPageNew([], { limit: -1, include: ids.join(','), include_by: 'id' }),
            cdr: this.ctdtCdrService.getCtdtCdrByPageNew([], { limit: -1, include: ids.join(','), include_by: 'ctdt_id', order: 'ASC', orderby: 'ordering' }),
            contributes: this.contributeService.getCourseCloContributeByPageNew(this.courseConditions, { limit: -1 })
        }).subscribe({
            next: data => {
                const allCdr = data.cdr.data || [];
                const parents = allCdr.filter(item => item.parent_id === 0).map(item => ({
                    ...item,
                    items: allCdr.filter(child => child.parent_id === item.id)
                }));
                this.list_ctdt = (data.ctdt.data || []).map(item => ({
                    ...item,
                    ctdt_cdr: parents.filter(parent => parent.ctdt_id === item.id)
                }));
                this.applyContributions(data.contributes.data || [], allCdr);
                this.state.set('success');
            },
            error: () => {
                this.state.set('error');
                this.notification.toastError('Không thể tải mapping CĐR - PI');
            }
        });
    }

    private applyContributions(contributions: { course_clo_id: number; ctdt_id: number; ctdt_cdr_id: number }[], cdrs: CtdtCdr[]): void {
        this.list_course_clo.forEach(clo => {
            this.list_ctdt.forEach(ctdt => {
                const selected = contributions
                    .filter(item => item.course_clo_id === clo.id && item.ctdt_id === ctdt.id)
                    .map(item => cdrs.find(cdr => cdr.id === item.ctdt_cdr_id))
                    .filter((item): item is CtdtCdr => !!item);
                if (selected.length) clo[`ctdt_cdr_${ctdt.id}`] = Helper.arraySort(selected, 'ordering');
            });
        });
    }

    decodeHtml(content?: string): string {
        if (!content) return '';
        const decoder = document.createElement('textarea');
        let decoded = content;
        for (let index = 0; index < 3; index++) {
            decoder.innerHTML = decoded;
            if (decoder.value === decoded) break;
            decoded = decoder.value;
        }
        return decoded;
    }

    blockArrowKeys(event: KeyboardEvent): void {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
            event.stopPropagation();
        }
    }

    saveMucTieuChung(): void {
        const id = this.selectedCourse?.id;
        if (!id || !this.selectedCourse) return;
        this.saving.set(true);
        this.courseService.update(id, { muctieu: this.selectedCourse.muctieu || '' }).subscribe({
            next: () => {
                this.saving.set(false);
                this.notification.toastSuccess('Lưu mục tiêu chung thành công');
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Lưu mục tiêu chung thất bại');
            }
        });
    }

    addMuctieu(): void {
        const courseId = this.selectedCourse?.id;
        if (!courseId || this.saving()) return;
        this.saving.set(true);
        const ordering = this.list_course_muctieu.length + 1;
        this.muctieuService.addCourseMuctieuChitiet({ course_id: courseId, ordering, kyhieu: `CO${ordering}`, noidung: '', ctdt_cdr_id: 0 }).subscribe({
            next: () => {
                this.saving.set(false);
                this.loadData(courseId);
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Thêm mục tiêu thất bại');
            }
        });
    }

    saveMuctieuChitiet(): void {
        if (this.saving()) return;
        const requests = this.list_course_muctieu.filter(item => item.id).map((item, index) => this.muctieuService.updateCourseMuctieuChitiet(item.id!, {
            noidung: item.noidung, ordering: index + 1, kyhieu: `CO${index + 1}`
        }));
        if (!requests.length) return;
        this.saving.set(true);
        forkJoin(requests).subscribe({
            next: () => {
                this.saving.set(false);
                this.notification.toastSuccess('Lưu mục tiêu chi tiết thành công');
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Lưu mục tiêu chi tiết thất bại');
            }
        });
    }

    deleteMuctieu(item: CourseMuctieuChitiet): void {
        if (!item.id) return;
        this.notification.confirmDelete(1).subscribe(confirmed => {
            if (!confirmed || this.saving()) return;
            this.saving.set(true);
            this.muctieuService.deleteCourseMuctieuChitiet(item.id!).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.loadData(this.selectedCourse?.id || 0);
                },
                error: () => {
                    this.saving.set(false);
                    this.notification.toastError('Xóa mục tiêu thất bại');
                }
            });
        });
    }

    addClo(): void {
        const courseId = this.selectedCourse?.id;
        if (!courseId || this.saving()) return;
        this.saving.set(true);
        const ordering = this.list_course_clo.length + 1;
        this.cloService.addCourseClo({ course_id: courseId, ordering, kyhieu: `CLO${ordering}`, noidung: '', course_muctieu_chitiet_id: 0, mucdo_donggop: 0 }).subscribe({
            next: () => {
                this.saving.set(false);
                this.loadData(courseId);
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Thêm CĐR thất bại');
            }
        });
    }

    saveClo(): void {
        if (this.saving()) return;
        const requests = this.list_course_clo.filter(item => item.id).map((item, index) => this.cloService.updateCourseClo(item.id!, {
            noidung: item.noidung,
            ordering: index + 1,
            kyhieu: `CLO${index + 1}`,
            course_muctieu_chitiet_id: item.course_muctieu_chitiet_id
        }));
        if (!requests.length) return;
        this.saving.set(true);
        forkJoin(requests).subscribe({
            next: () => {
                this.saving.set(false);
                this.notification.toastSuccess('Lưu CĐR thành công');
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Lưu CĐR thất bại');
            }
        });
    }

    deleteClo(item: CourseClo): void {
        if (!item.id) return;
        this.notification.confirmDelete(1).subscribe(confirmed => {
            if (!confirmed || this.saving()) return;
            this.saving.set(true);
            this.cloService.deleteCourseClo(item.id!).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.loadData(this.selectedCourse?.id || 0);
                },
                error: () => {
                    this.saving.set(false);
                    this.notification.toastError('Xóa CĐR thất bại');
                }
            });
        });
    }

    chooseMuctieuForClo(clo: CourseClo, muctieu: CourseMuctieuChitiet): void {
        clo.course_muctieu_chitiet_id = muctieu.id || 0;
    }

    openPiDialog(clo: CourseCloWithPi, ctdt: CtdtWithCdr): void {
        this.selectedClo = clo;
        this.selectedCtdt = ctdt;
        this.selectedStates = {};
        this.getSelectedPi(clo, ctdt).forEach(item => this.selectedStates[item.id!] = true);
        this.showPiDialog = true;
    }

    closePiDialog(): void {
        this.showPiDialog = false;
        this.selectedClo = null;
        this.selectedCtdt = null;
    }

    getSelectedPi(clo: CourseCloWithPi, ctdt: Ctdt): CtdtCdr[] {
        return (clo[`ctdt_cdr_${ctdt.id}`] as CtdtCdr[] | undefined) || [];
    }

    toggleAllChildren(parent: CtdtCdrGroup, event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        parent.items.forEach(item => this.selectedStates[item.id!] = checked);
        this.syncSelectedPi();
    }

    syncSelectedPi(): void {
        if (!this.selectedClo || !this.selectedCtdt) return;
        const selected = this.selectedCtdt.ctdt_cdr
            .flatMap(parent => parent.items)
            .filter(item => this.selectedStates[item.id!]);
        this.selectedClo[`ctdt_cdr_${this.selectedCtdt.id}`] = Helper.arraySort(selected, 'ordering');
    }

    isAllSelected(parent: CtdtCdrGroup): boolean {
        return parent.items.length > 0 && parent.items.every(item => this.selectedStates[item.id!]);
    }

    isIndeterminate(parent: CtdtCdrGroup): boolean {
        const count = parent.items.filter(item => this.selectedStates[item.id!]).length;
        return count > 0 && count < parent.items.length;
    }

    savePiOnClo(): void {
        const courseId = this.selectedCourse?.id;
        if (!courseId || this.saving()) return;
        const requests = [this.contributeService.deleteCourseCloContributeByCol(courseId.toString(), 'course_id')];
        this.list_course_clo.forEach(clo => this.list_ctdt.forEach(ctdt => this.getSelectedPi(clo, ctdt).forEach(pi => {
            if (clo.id && ctdt.id && pi.id) {
                requests.push(this.contributeService.addCourseCloContribute({
                    course_id: courseId,
                    course_clo_id: clo.id,
                    ctdt_id: ctdt.id,
                    ctdt_cdr_parent_id: pi.parent_id,
                    ctdt_cdr_id: pi.id
                }));
            }
        })));
        this.saving.set(true);
        forkJoin(requests).subscribe({
            next: () => {
                this.saving.set(false);
                this.closePiDialog();
                this.notification.toastSuccess('Lưu mapping CLO - PI thành công');
            },
            error: () => {
                this.saving.set(false);
                this.notification.toastError('Lưu mapping CLO - PI thất bại');
            }
        });
    }
}
