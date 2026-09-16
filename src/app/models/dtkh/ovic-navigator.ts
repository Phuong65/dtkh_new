interface OvicNavElement {
	page : number;
	isActive : boolean;
	class : string;
	type : 'button' | 'span';
	title : string;
}

export interface OvicNavigator {
	navs : OvicNavElement[];
	lastestPage : number;
}
