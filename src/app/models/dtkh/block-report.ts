export interface BlockReport {
	sum : number;
	child : BlockReportChild[];
}

export interface BlockReportChild {
	title : string;
	count : number;
	color : string; // hexadecimal
}

