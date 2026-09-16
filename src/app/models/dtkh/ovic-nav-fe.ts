export interface OvicNavFe {
	class? : string;
	label : string;
	eventName? : string;
	href? : string;
	routerLink? : string | [];
	children? : OvicNavFe[];
}

export interface OvicMobilePanel {
	id : number;
	state : string; // closed | opened | sub-opened
	father? : number;
	elements : OvicSimpleNav[];
}

export interface OvicSimpleNav {
	label : string;
	eventName? : string;
	href? : string;
	routerLink? : string | [];
	childPanel? : number;
	class? : string;
}
