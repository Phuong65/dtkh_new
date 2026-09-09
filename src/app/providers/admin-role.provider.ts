import { InjectionToken, ValueProvider } from '@angular/core';
import { SysRoleName } from '@models/role';

export const PROVIDED_ROLE = new InjectionToken<SysRoleName>('Administrator role');

export const ROLE_PROVIDER: Record<SysRoleName, ValueProvider> = {
    administrator: { provide: PROVIDED_ROLE, useValue: 'administrator' }
};