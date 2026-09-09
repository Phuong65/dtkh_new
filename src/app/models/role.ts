import { InjectionToken } from '@angular/core';

export interface Role {
    id: number;
    description: string;
    name: 'administrator';
    ordering: number;
    title: string;
}

export type PickRole = Pick<Role, 'id' | 'description' | 'name' | 'ordering' | 'title'>;
export type SysRoleName = 'administrator';

export const APP_REDIRECT_LINKS = new InjectionToken<Map<SysRoleName, string>>('default administrator redirect');

export const createAppRedirectLinks = (): Map<SysRoleName, string> => new Map([
    ['administrator', '/admin/dashboard']
]);
