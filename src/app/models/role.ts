import { InjectionToken } from '@angular/core';

export interface Role {
    id: number;
    description: string;
    name: SysRoleName;
    ordering: number;
    title: string;
}

export type PickRole = Pick<Role, 'id' | 'description' | 'name' | 'ordering' | 'title'>;
export type SysRoleName = 'administrator' | 'daotao_ld';

export interface RoleDashboardMenu {
    id        : string;
    title     : string;
    url       : string;
    customSvg : string;
    pms       : [ number , number , number , number ];
}

export const APP_REDIRECT_LINKS = new InjectionToken<Map<SysRoleName, string>>('default administrator redirect');

export const createAppRedirectLinks = (): Map<SysRoleName, string> => new Map([
    ['administrator', '/admin/dashboard'],
    ['daotao_ld', '/admin/daotao_ld/dashboard']
]);

export const createDefaultDashboardMenus = ( roles : readonly PickRole[] ) : RoleDashboardMenu[] => {
    const redirectLinks : Map<SysRoleName , string> = createAppRedirectLinks();
    const dashboardRoles : Set<SysRoleName> = new Set<SysRoleName>();
    return roles.reduce( ( dashboards : RoleDashboardMenu[] , role : PickRole ) : RoleDashboardMenu[] => {
        if ( dashboardRoles.has( role.name ) ) {
            return dashboards;
        }
        const redirectLink : string = redirectLinks.get( role.name ) || '';
        if ( !redirectLink ) {
            return dashboards;
        }
        dashboardRoles.add( role.name );
        dashboards.push( {
            id        : `${ role.name }-dashboard` ,
            title     : 'Dashboard' ,
            url       : redirectLink.replace( /^\/admin\// , '' ) ,
            customSvg : 'custom-status-up' ,
            pms       : [ 1 , 0 , 0 , 0 ]
        } );
        return dashboards;
    } , [] );
};
