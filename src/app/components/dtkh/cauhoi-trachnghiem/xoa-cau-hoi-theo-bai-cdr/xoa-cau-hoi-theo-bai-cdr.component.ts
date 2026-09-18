import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export interface DeleteQuestionsResult {
    deletedGroupCount: number;
    deletedRecordCount: number;
    protectedGroupCount: number;
    protectedRecordCount: number;
}

@Component({
    selector: 'app-xoa-cau-hoi-theo-bai-cdr',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './xoa-cau-hoi-theo-bai-cdr.component.html',
    styleUrls: ['./xoa-cau-hoi-theo-bai-cdr.component.css']
})
export class XoaCauHoiTheoBaiCdrComponent {
    @Input() courseTitle: string;

    @Input() scopeLabel: string;

    @Input() targetLabel: string;

    @Input() deletableGroupCount: number = 0;

    @Input() deletableRecordCount: number = 0;

    @Input() protectedGroupCount: number = 0;

    @Input() protectedRecordCount: number = 0;

    @Input() confirmAction: () => Observable<DeleteQuestionsResult>;

    accepted: boolean = false;

    submitting: boolean = false;

    errorMessage: string = '';

    constructor(public activeModal: NgbActiveModal) { }

    confirmDelete(): void {
        if (!this.accepted || !this.deletableGroupCount || this.submitting || !this.confirmAction) {
            return;
        }

        this.submitting = true;
        this.errorMessage = '';

        this.confirmAction().pipe(take(1)).subscribe({
            next: result => this.activeModal.close(result),
            error: () => {
                this.submitting = false;
                this.errorMessage = 'Xóa thất bại, vui lòng thử lại.';
            }
        });
    }
}
