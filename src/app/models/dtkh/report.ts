import { ApexChart , ApexFill , ApexNonAxisChartSeries , ApexResponsive , ApexStroke } from 'ng-apexcharts';

export type MajorCounterLabel = {
	name : string,
	sum : string,
	excellent : string,
	veryGood : string, // giỏi
	good : string, // khá
	littleGood : string, // trung bình khá
	normal : string, // trung bình
	graduatedOnTime? : string, // Tỉ lệ tốt nghiệp đúng thời hạn
};

export type MajorCounter = { code : string, name : string, sum : number, excellent : number, good : number, veryGood : number, littleGood : number, normal : number, graduatedOnTime? : number }

export interface PolarChartOptions {
	series : ApexNonAxisChartSeries;
	chart : ApexChart;
	responsive : ApexResponsive[];
	labels : any;
	stroke : ApexStroke;
	fill : ApexFill;
	loading : boolean;
}
