import { InjectionToken, ValueProvider } from '@angular/core';
import { SysRoleName } from '@models/role';

export const PROVIDED_ROLE = new InjectionToken<SysRoleName>('Administrator role');

// export const ROLE_PROVIDER: Record<SysRoleName, ValueProvider> = {
//     administrator: { provide: PROVIDED_ROLE, useValue: 'administrator' },
//     daotao_ld: { provide: PROVIDED_ROLE, useValue: 'daotao_ld' },
//     truong_ld: { provide: PROVIDED_ROLE, useValue: 'truong_ld' }, 
//     bomon_ld: {provide:PROVIDED_ROLE,useValue:'bomon_ld'},

// };

export const ROLE_PROVIDER: Record<SysRoleName, ValueProvider> = {
    administrator: {provide: PROVIDED_ROLE,useValue: 'administrator',},
    daotao_ld: {provide: PROVIDED_ROLE,useValue: 'daotao_ld',},
    truong_ld: {provide: PROVIDED_ROLE,useValue: 'truong_ld',},
    daotao_troly: {provide: PROVIDED_ROLE,useValue: 'daotao_troly',},
    khoa_ld: {provide: PROVIDED_ROLE,useValue: 'khoa_ld',},
    teacher: {provide: PROVIDED_ROLE,useValue: 'teacher',},
    bomon_ld: {provide: PROVIDED_ROLE,useValue: 'bomon_ld',},
    khaothi_ld: {provide: PROVIDED_ROLE,useValue: 'khaothi_ld',},
    khaothi_hdthi_chutich: {provide: PROVIDED_ROLE,useValue: 'khaothi_hdthi_chutich',},
    cthssv_ld: {provide: PROVIDED_ROLE,useValue: 'cthssv_ld',},
};