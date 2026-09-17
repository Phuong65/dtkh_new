import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, AbstractControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Popover } from 'primeng/popover';
import { IctuLibraryComponent } from '@components/ictu-library/ictu-library.component';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { IctuFile } from '@models/file';

export interface DocumentFileAndLink {
    ordering: number;
    type: 'link' | 'file';
    title: string;
    link?: string;
    file?: IctuFile;
}

@Component({
    selector: 'form-document-file-and-link',
    standalone: true,
    imports: [CommonModule, FormsModule, Popover, MatButton],
    templateUrl: './form-document-file-and-link.component.html',
    styleUrl: './form-document-file-and-link.component.css'
})
export class FormDocumentFileAndLinkComponent implements OnChanges {

    @Input() docDefault: DocumentFileAndLink[] = [];
    @Input() formField: AbstractControl | null = null;
    @Input() disabled = false;
    @Output() busyChange = new EventEmitter<boolean>();
    @Output() documentsChange = new EventEmitter<DocumentFileAndLink[]>();

    list_document: DocumentFileAndLink[] = [];
    documentTypeLink: Partial<DocumentFileAndLink> = { title: '', link: '', ordering: null, type: 'link' };

    private readonly dialog = inject(MatDialog);
    private readonly auth = inject(AuthenticationService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyed$ = new Subject<void>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['docDefault']) {
            const documents = Array.isArray(this.docDefault) ? this.docDefault : [];
            this.list_document = documents.map((document: any, index: number) => {
                if (document?.type === 'file' || document?.type === 'link') {
                    return {
                        ordering: document.ordering ?? index + 1,
                        type: document.type,
                        title: document.title || document.file?.title || document.file?.name || '',
                        link: document.link || '',
                        file: document.file
                    };
                }
                return {
                    ordering: index + 1,
                    type: 'file',
                    title: document?.title || document?.name || '',
                    file: document
                };
            });
        }
    }

    openFileManager(): void {
        if (this.disabled) return;
        const dialogRef = this.dialog.open(IctuLibraryComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '1200px',
            maxHeight: '800px',
            panelClass: 'ictu-library-dialog',
            disableClose: false
        });
        dialogRef.componentRef?.setInput('userId', this.auth.user?.id || 0);
        dialogRef.componentRef?.setInput('donviId', this.auth.user?.donvi_id || 0);
        dialogRef.componentRef?.setInput('selectionMode', true);
        this.busyChange.emit(true);
        dialogRef.componentInstance.fileSelected.subscribe((file: IctuFile) => {
            if (!this.list_document.some(doc => doc.type === 'file' && doc.file?.id === file.id)) {
                this.list_document.push({
                    ordering: this.list_document.length + 1,
                    type: 'file',
                    title: file.title || file.name,
                    file
                });
                this.updateFormField();
            }
            dialogRef.close();
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(() => this.busyChange.emit(false));
    }

    deleteItem(index: number): void {
        if (this.disabled) return;
        this.list_document.splice(index, 1);
        this.updateFormField();
    }

    openAddLink(popover: any, event: Event): void {
        this.documentTypeLink = { title: '', link: '', ordering: null, type: 'link' };
        popover.toggle(event);
    }

    addLinkToList(popover: any): void {
        if (!this.documentTypeLink.title) {
            this.notificationService.toastWarning('Vui lòng nhập tiêu đề tài liệu');
            return;
        }
        this.list_document.push({ ordering: this.list_document.length + 1, type: 'link', title: this.documentTypeLink.title!, link: this.documentTypeLink.link || '' });
        this.documentTypeLink = { title: '', link: '', ordering: null, type: 'link' };
        this.updateFormField();
        popover.hide();
    }

    private updateFormField(): void {
        const documents = this.list_document.map(document => ({ ...document }));
        if (this.formField) {
            this.formField.setValue(documents);
            this.formField.markAsDirty();
            this.formField.updateValueAndValidity();
        }
        this.documentsChange.emit(documents);
    }

    ngOnDestroy(): void { this.destroyed$.next(); this.destroyed$.complete(); }
}
