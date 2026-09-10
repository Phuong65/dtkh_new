import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaoTaoRoutingModule } from './dao-tao-routing.module';
import { ROLE_PROVIDER } from '@app/providers/admin-role.provider';

@NgModule({
    providers: [ ROLE_PROVIDER.daotao_ld ],
    imports: [ CommonModule, DaoTaoRoutingModule ]
})
export class DaoTaoModule {}
