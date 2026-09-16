export interface Room {
    id?: number;
    icon: string;
    title: string;
    owned: number;
    joiners: string;
    banned: string;
    app_name: string;
}
