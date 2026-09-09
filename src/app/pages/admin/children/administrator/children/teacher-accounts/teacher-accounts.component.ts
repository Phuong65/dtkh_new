import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { User } from '@models/user';
import { AdminUserPayload, UserService } from '@services/user.service';
import { NotificationService } from '@services/notification.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    selector: 'app-teacher-accounts',
    templateUrl: './teacher-accounts.component.html',
    styleUrl: './teacher-accounts.component.css'
})
export default class TeacherAccountsComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly notification = inject(NotificationService);

    readonly accountForm = this.formBuilder.nonNullable.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        display_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', Validators.minLength(8)],
        status: [1]
    });

    accounts: User[] = [];
    filteredAccounts: User[] = [];
    searchTerm = '';
    editingId: number | null = null;
    loading = false;
    saving = false;

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.loading = true;
        this.userService.listForAdministration().pipe(finalize(() => this.loading = false)).subscribe({
            next: (accounts: User[]) => {
                this.accounts = accounts;
                this.applyFilter();
            },
            error: () => this.notification.toastError('Không thể tải danh sách tài khoản giáo viên')
        });
    }

    applyFilter(): void {
        const keyword = this.searchTerm.trim().toLocaleLowerCase();
        this.filteredAccounts = keyword
            ? this.accounts.filter((account: User) => [account.username, account.display_name, account.email, account.phone].some((value: string) => value?.toLocaleLowerCase().includes(keyword)))
            : [...this.accounts];
    }

    startCreate(): void {
        this.editingId = null;
        this.accountForm.reset({ username: '', display_name: '', email: '', phone: '', password: '', status: 1 });
        this.accountForm.controls.password.addValidators(Validators.required);
        this.accountForm.controls.password.updateValueAndValidity();
    }

    startEdit(account: User): void {
        this.editingId = account.id;
        this.accountForm.reset({
            username: account.username,
            display_name: account.display_name,
            email: account.email,
            phone: account.phone,
            password: '',
            status: account.status
        });
        this.accountForm.controls.password.removeValidators(Validators.required);
        this.accountForm.controls.password.updateValueAndValidity();
    }

    cancelEdit(): void {
        this.editingId = null;
        this.accountForm.reset({ username: '', display_name: '', email: '', phone: '', password: '', status: 1 });
    }

    save(): void {
        if (this.accountForm.invalid) {
            this.accountForm.markAllAsTouched();
            return;
        }

        const value = this.accountForm.getRawValue();
        const payload: AdminUserPayload = {
            username: value.username,
            display_name: value.display_name,
            email: value.email,
            phone: value.phone,
            password: value.password,
            status: value.status
        };
        if (!payload.password) {
            delete payload.password;
        }

        this.saving = true;
        const request = this.editingId === null
            ? this.userService.createForAdministration(payload)
            : this.userService.updateForAdministration(this.editingId, payload);
        request.pipe(finalize(() => this.saving = false)).subscribe({
            next: () => {
                this.notification.toastSuccess(this.editingId === null ? 'Tạo tài khoản giáo viên thành công' : 'Cập nhật tài khoản giáo viên thành công');
                this.cancelEdit();
                this.loadAccounts();
            },
            error: () => this.notification.toastError('Không thể lưu tài khoản giáo viên')
        });
    }

    remove(account: User): void {
        this.notification.confirmDelete(1).subscribe((confirmed: boolean) => {
            if (!confirmed) {
                return;
            }
            this.userService.deleteForAdministration(account.id).subscribe({
                next: () => {
                    this.notification.toastSuccess('Xóa tài khoản giáo viên thành công');
                    this.loadAccounts();
                },
                error: () => this.notification.toastError('Không thể xóa tài khoản giáo viên')
            });
        });
    }

    toggleStatus(account: User): void {
        this.userService.updateForAdministration(account.id, { status: account.status ? 0 : 1 }).subscribe({
            next: () => {
                account.status = account.status ? 0 : 1;
                this.notification.toastSuccess('Cập nhật trạng thái thành công');
            },
            error: () => this.notification.toastError('Không thể cập nhật trạng thái')
        });
    }

}
