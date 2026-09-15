import { Component, inject, signal, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IctuLibraryComponent } from '@components/ictu-library/ictu-library.component';
import { IctuFile, ICTUStandardFile } from '@models/file';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '@services/authentication.service';

export interface IctuFilePickerData {
    folderId?: number;
    donviId: number;
    userId: number;
    multi?: boolean;
    fileTypes?: string[];
}

@Component({
    selector: 'app-ictu-file-picker',
    standalone: true,
    imports: [CommonModule, MatDialogModule, NgClass, DecimalPipe],
    template: `
        <button class="btn btn-primary" (click)="openPicker()" type="button">
            <i class="fa fa-folder-open"></i> Chọn từ thư viện
        </button>
        @if (selectedFiles().length > 0) {
            <div class="selected-files mt-2">
                @for (file of selectedFiles(); track file.id) {
                    <div class="selected-file-item d-flex align-items-center gap-2 p-2 border rounded mb-2">
                        <i class="fa" [ngClass]="getFileIcon(file)"></i>
                        <span class="flex-grow-1">{{ file.title }}</span>
                        <small class="text-muted">{{ file.size | number }} bytes</small>
                        <button class="btn btn-sm btn-outline-danger" (click)="removeFile(file)">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                }
            </div>
        }
    `,
    styles: [`
        .selected-file-item {
            background: #f8f9fa;
        }
        .selected-file-item i {
            font-size: 1.2rem;
            color: #f59e0b;
        }
    `]
})
export class IctuFilePickerComponent implements OnInit, OnDestroy {
    @Input() data: IctuFilePickerData = { donviId: 0, userId: 0, multi: true };
    @Output() filesSelected = new EventEmitter<ICTUStandardFile[]>();
    @Output() fileSelected = new EventEmitter<ICTUStandardFile>();

    private dialog = inject(MatDialog);
    private auth = inject(AuthenticationService);
    private destroyed$ = new Subject<void>();

    selectedFiles = signal<ICTUStandardFile[]>([]);

    ngOnInit() {
        if (!this.data.donviId && this.auth.user?.donvi_id) {
            this.data.donviId = this.auth.user.donvi_id;
        }
        if (!this.data.userId && this.auth.user?.id) {
            this.data.userId = this.auth.user.id;
        }
    }

    openPicker() {
        const dialogRef = this.dialog.open<IctuLibraryComponent, IctuFilePickerData, ICTUStandardFile[] | null>(
            IctuLibraryComponent,
            {
                width: '90vw',
                height: '90vh',
                maxWidth: '1200px',
                maxHeight: '800px',
                panelClass: 'ictu-library-dialog',
                data: this.data,
                disableClose: false
            }
        );

        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result) {
                return;
            }
            const files: ICTUStandardFile[] = Array.isArray(result) ? result : [result];
            const newFiles = files.filter(f => !this.selectedFiles().some(existing => existing.id === f.id));
            if (newFiles.length === 0) {
                return;
            }
            this.selectedFiles.update((files: ICTUStandardFile[]): ICTUStandardFile[] => [...files, ...newFiles]);
            this.filesSelected.emit(this.selectedFiles());
            if (!this.data.multi) {
                this.fileSelected.emit(this.selectedFiles()[0]);
            }
        });
    }

    removeFile(file: ICTUStandardFile) {
        this.selectedFiles.update(files => files.filter(f => f.id !== file.id));
        this.filesSelected.emit(this.selectedFiles());
    }

    getFileIcon(file: ICTUStandardFile): string {
        if (!file.ext) return 'fa-file';
        const ext = file.ext.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'fa-file-image';
        if (['pdf'].includes(ext)) return 'fa-file-pdf';
        if (['doc', 'docx'].includes(ext)) return 'fa-file-word';
        if (['xls', 'xlsx'].includes(ext)) return 'fa-file-excel';
        if (['ppt', 'pptx'].includes(ext)) return 'fa-file-powerpoint';
        if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'fa-file-video';
        if (['mp3', 'wav', 'ogg'].includes(ext)) return 'fa-file-audio';
        if (['zip', 'rar', '7z'].includes(ext)) return 'fa-file-archive';
        return 'fa-file';
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}