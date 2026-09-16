export interface ElnDonHang{
	id? : number;
	user_id : number;
	customer_info:Customer;
	total:number;
	code: string;
	tax: string;
	items: Item;
	payment_method: string;
	status: number;
	checker_id: number;
}
export interface Customer{
	name:string,
	phone:string,
	email:string,
	address:string,
}
export interface Item{
	course_id:number,
	name:string,
	option:string,
	price:number
}