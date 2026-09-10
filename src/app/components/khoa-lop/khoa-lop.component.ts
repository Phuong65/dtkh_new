import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotificationService} from "@core/services/notification.service";
import {ClassesService} from "@shared/services/classes.service";
import {ClassStudentService} from "@shared/services/class-student.service";
import {HttpParamsHeplerService} from "@core/services/http-params-hepler.service";
import {ConditionOption} from "@shared/models/condition-option";
import {OvicQueryCondition} from "@core/models/dto";
import {AuthService} from "@core/services/auth.service";
import {combineLatest, forkJoin, Observable, of, startWith, switchMap} from "rxjs";
import {DonViService} from "@shared/services/don-vi.service";
import {CategoriesService, Category} from "@shared/services/categories.service";
import {DonVi} from "@shared/models/don-vi";
import {SharedModule} from "@shared/shared.module";
import {PaginatorModule} from "primeng/paginator";
import {MatLineModule} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClassManagement, ClassManagementService} from "@shared/services/class-management.service";
import {map} from "rxjs/operators";
import {RadioButtonModule} from "primeng/radiobutton";
import {ProfileService} from "@core/services/profile.service";
import {ElngUserProfileService} from "@shared/services/elearning-user-profile.service";
import {ElngUserProfile} from "@shared/models/elng-user-profile";
import {BUTTON_NO, BUTTON_YES} from "@core/models/buttons";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";


@Component({
    selector: 'app-khoa-lop',
    standalone: true,
    imports: [CommonModule, SharedModule, PaginatorModule, MatLineModule, MatListModule, ButtonModule, RippleModule, ReactiveFormsModule, RadioButtonModule, TableModule, TooltipModule],
    templateUrl: './khoa-lop.component.html',
    styleUrls: ['./khoa-lop.component.css']
})
export class KhoaLopComponent implements OnInit {
    @ViewChild('formInfo') formInfo: TemplateRef<any>;
    @ViewChild('formEditManagevent') formEditManagevent: TemplateRef<any>;
    @ViewChild('formViewStudent') formViewStudent: TemplateRef<any>;
    @ViewChild('formAddStudent') formAddStudent: TemplateRef<any>;

    listKhoa: any[];
    listDonvi: DonVi[];
    listNganhBoMon: Category[];

    list_donvi_chuyenmon: DonVi[] = [];
    listClassManagement: ClassManagement[] = [];

    listTaotudong = [
        {title: 'Tự động', value: 1},
        {title: 'Tạo từ form', value: 0}
    ]


    displayModal: boolean = false;
    closeLeft: boolean = false;
    categoryFilter: number;
    form: FormGroup;
    formEdit: FormGroup;
    nganh_bomon_id: number = null;
    khoaSelect_id: number = null;
    classSelect_id: number;

    constructor(
        private noitifi: NotificationService,
        private classesService: ClassesService,
        private classStudentService: ClassStudentService,
        private httpHelper: HttpParamsHeplerService,
        private auth: AuthService,
        private donViService: DonViService,
        private categoriesService: CategoriesService,
        private fb: FormBuilder,
        private classManagementService: ClassManagementService,
        private profileService: ProfileService,
        private studentsService: ElngUserProfileService
        // private
    ) {
        this.form = this.fb.group({
            nganh_id: [null, Validators.required],
            khoa: ['', Validators.required],
            donvi_id: [null, Validators.required],
            taotudong: [0, Validators.required],
            soluonglop: [''],
            tiento:[''],
            hauto:['']
        });
        this.formEdit = this.fb.group({
            nganh_id: [null, Validators.required],
            khoa: ['', Validators.required],
            donvi_id: [null, Validators.required],
            title:['',Validators.required],
            kyhieu:['',Validators.required],
        });


    }


    nameClassNewCreat:string = '';
    ngOnInit(): void {

        const tientoCtrl = this.form.get('tiento');
        const khoaCtrl = this.form.get('khoa');
        const taotudongCtrl = this.form.get('taotudong');

        if (tientoCtrl && khoaCtrl && taotudongCtrl) {
            combineLatest([
                this.form.get('tiento')!.valueChanges.pipe(startWith(this.form.get('tiento')!.value)),
                this.form.get('khoa')!.valueChanges.pipe(startWith(this.form.get('khoa')!.value)),
                this.form.get('hauto')!.valueChanges.pipe(startWith(this.form.get('hauto')!.value)),
                this.form.get('taotudong')!.valueChanges.pipe(startWith(this.form.get('taotudong')!.value))
            ]).subscribe(([tiento, khoa, hauto, taotudong]) => {
                if (taotudong === 0) {
                    this.nameClassNewCreat =khoa && tiento  ? `${tiento.trim() || ''} - K${khoa || ''}${hauto.toUpperCase() || ''}` : '';
                }
            });
        }

        this.initData();
    }

    initData() {

        const condition_donvi: ConditionOption = {
            condition: [
                {conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-1'},
                {
                    conditionName: 'parent_id',
                    condition: OvicQueryCondition.equal,
                    value: this.auth.userDonViId.toString(),
                    orWhere: 'and'
                }
            ],
            set: [
                {label: 'limit', value: '-1'}
            ],
            page: null
        };

        this.donViService.getDonviByPageNew(condition_donvi).subscribe({
            next: (_donvi) => {
                this.listDonvi = _donvi.data;

                this.displayModal = false;

            },
            error: () => {
                this.noitifi.toastWarning('Lỗi kết nối!');
                this.displayModal = false;
            }
        })
    }

    onChangeFilterChuyenmon(event) {

        this.categoryFilter = event['id'];
        this.getDataKhoaAndNganh(event['id'])

    }

    getDataKhoaAndNganh(id: number) {

        if(id == 0 ){
            return;
        }
        this.noitifi.isProcessing(true);

        const conditionKhoaByClassManegement: ConditionOption = {
            condition: [
                {conditionName: 'donvi_id', condition: OvicQueryCondition.equal, value: id.toString()}
            ],
            set: [
                {label: 'groupby', value: 'khoa'},
                {label: 'orderby', value: 'Khoa'},
                {label: 'order', value: 'ASC'},
                {label: 'limit', value: '-1'},
            ]
            ,
            page: '1'
        }
        const conditionNganh: ConditionOption = {
            condition: [
                {conditionName: 'donvi_chuyenmon_id', condition: OvicQueryCondition.equal, value: id.toString()},
                {conditionName: 'type', condition: OvicQueryCondition.equal, value: 'nganh'},
                {conditionName: 'status', condition: OvicQueryCondition.equal, value: '1'},
            ],
            set: [
                {label: 'limit', value: '-1'},
            ],
            page: '1'
        }

        forkJoin([
            this.categoriesService.getDataByPageNew(conditionNganh).pipe(map(m => m.data)),
            this.classManagementService.getDataByPageNew(conditionKhoaByClassManegement)
        ]).subscribe({
            next: ([listNganh, {data}]) => {
                this.noitifi.isProcessing(false);
                this.listNganhBoMon = listNganh;
                this.listKhoa = data.length > 0 ? data.map(m => {
                    m['__khoaConvert'] = 'Khóa ' + m.khoa;
                    return m;
                }) : [];
            }, error: () => {
                this.noitifi.toastError('Mất kết nối với máy chủ');
                this.noitifi.isProcessing(false);
            }
        })
    }

    closeLeftBody() {
        this.closeLeft = !this.closeLeft;
    }

    btnOpenFormAdd() {
        // this.f['category_id'].setValue(this.categoryFilter);
        this.form.reset({
            nganh_id: null,
            khoa: null,
            donvi_id: null,
            taotudong: 0,
            soluonglop: null,
            tiento:'',
            hauto:'',
        })
        this.noitifi.openSideNavigationMenu({template: this.formInfo, size: 600, offsetTop: '0px'})
    }

    closeForm() {
        this.noitifi.closeSideNavigationMenu();
    }

    get f() {
        return this.form.controls;
    }

    saveFormData() {
        const formData = this.form.value;
        if (this.form.valid) {
            if (formData.taotudong == 1) {
                if (formData['soluonglop'] > 0) {
                    const ArrAddNew = [];

                    if(formData['soluonglop'] == 1){
                        ArrAddNew.push({
                            nganh_id: formData.nganh_id,
                            khoa: formData.khoa,
                            donvi_id: formData.donvi_id,
                            title: formData.tiento.trim() + ' - K' + formData.khoa
                        })
                    }else{
                        for (let i: number = 0; i < Number(formData['soluonglop']); i++) {
                            const item = {
                                nganh_id: formData.nganh_id,
                                khoa: formData.khoa,
                                donvi_id: formData.donvi_id,
                                title: formData.tiento.trim() + ' - K' + formData.khoa + this.numberToLetters(i + 1)
                            }
                            ArrAddNew.push(item);
                        }
                    }
                    this.noitifi.isProcessing(false);

                    this.oncheckNameClass(ArrAddNew).subscribe({
                        next: (data) => {
                            const arrConvert = this.updateDuplicateNames(ArrAddNew, data)
                            this.summitByTudong(arrConvert)
                            this.noitifi.isProcessing(false);

                        }, error: () => {
                            this.noitifi.isProcessing(false);
                            this.noitifi.toastError('Mất kết nối với máy chủ');
                        }
                    })
                } else {
                    this.noitifi.toastWarning('Vui lòng nhập số lượng lớp quản lý muốn tạo phù hợp');
                }


            } else {
                const item = {
                    nganh_id: formData.nganh_id,
                    khoa: formData.khoa,
                    donvi_id: formData.donvi_id,
                    title: formData.tiento.trim() +' - K'+ formData.khoa + formData.hauto.toUpperCase()
                }
                this.submitOnlyItem(item).subscribe({
                    next: (data) => {
                        this.noitifi.isProcessing(false);

                        if (data !== 0) {
                            this.closeForm();
                            this.noitifi.toastSuccess('Tạo mới thành công');
                            if(this.categoryFilter){
                                this.getDataKhoaAndNganh(this.categoryFilter);
                            }
                        } else {
                            this.noitifi.toastWarning('Tên lớp đã được sử dụng');
                        }

                    }, error: () => {
                        this.noitifi.isProcessing(false);
                        this.noitifi.toastError('Mất kết nối với máy chủ ');
                    }
                })
            }


        } else {
            this.noitifi.toastError('Vui lòng nhập đủ thông tin');
        }
    }

    numberToLetters(num: number): string {
        let result = '';
        while (num > 0) {
            num--;
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26);
        }
        return result;
    }

    btnChangeRadioInput(event) {
        this.f['tiento'].setValue('');
    }


    onChangeNganh(event) {

        this.nganh_bomon_id = event['id']
        this.listStudentByClass = [];
        this.recordsFiltered = 0;
        this.btnGetClassManagement()
    }

    submitOnlyItem(item: any): Observable<number> {
        const condition: ConditionOption = {
            condition: [
                {
                    conditionName: 'title',
                    condition: OvicQueryCondition.like,
                    value: item.title
                },
            ],
            set: [{label: 'limit', value: '1'}],
            page: null
        }
        return this.classManagementService.getDataByPageNew(condition).pipe(switchMap(m => {
            const data = m.data.length

            return data > 0 ? of(0) : this.classManagementService.add(item);
        }))
    }

    btnSelectKhoa(item: ClassManagement) {
        this.khoaSelect_id = item.khoa;
        this.nganh_bomon_id = null;
        this.classSelect_id = null;
        this.listStudentByClass = [];
        // this.listNganhBoMon = [];
        this.classManagementSelect = null;
        this.btnGetClassManagement()
    }

        btnGetClassManagement() {
        if (this.categoryFilter && this.khoaSelect_id) {
            const conditionGetLop: ConditionOption = {
                condition: [
                    {
                        conditionName: 'donvi_id',
                        condition: OvicQueryCondition.equal,
                        value: this.categoryFilter.toString()
                    },
                    {
                        conditionName: 'khoa',
                        condition: OvicQueryCondition.equal,
                        value: this.khoaSelect_id.toString()
                    },
                ],
                set: [
                    {label: 'limit', value: '-1'},
                    {label: 'order', value: 'ASC'},
                    {label: 'orderby', value: 'title'},
                ],
                page: '1'
            }
            if (this.nganh_bomon_id) {
                conditionGetLop.condition.push({
                    conditionName: 'nganh_id',
                    condition: OvicQueryCondition.equal,
                    value: this.nganh_bomon_id.toString()
                })
            }

            this.noitifi.isProcessing(true);
            this.classManagementService.getDataByPageNew(conditionGetLop).pipe(switchMap(m=>this.getTotalStudentByClass(m.data))).subscribe({
                next: (data) => {
                    this.listClassManagement = data.length > 0 ? data.sort((a, b) => a.title.localeCompare(b.title)).map((m,index)=>{
                        m['_index'] = index+ 1;
                        m['_nganh_converted'] = this.listNganhBoMon.find(f=>f.id === m.nganh_id) ? this.listNganhBoMon.find(f=>f.id === m.nganh_id).title : ' ';
                        return m;
                    }): [];
                    this.noitifi.isProcessing(false);
                }, error: () => {
                    this.noitifi.isProcessing(false);
                    this.noitifi.toastError('Mất kết nối với máy chủ');
                }
            })
        }
    }

    getTotalStudentByClass(data:ClassManagement[]):Observable<ClassManagement[]>{
        const index = data.findIndex(f=>f['_totalStudent'] === undefined);
        if(index !== -1){
            const item = data[index];
            const conditionGetProfile: ConditionOption = {
                condition: [
                    // {conditionName: 'class_management_id', condition: OvicQueryCondition.equal, value: '0'},
                    {conditionName:'class_management_id',condition:OvicQueryCondition.equal,value: item.id.toString()},
                    {conditionName: 'teacher', condition: OvicQueryCondition.equal, value: '0'},
                ],
                page: '1',
                set: [
                    {label: 'limit', value: '-1'},

                ]
            }
            return this.studentsService.getTotalUserProfile(conditionGetProfile.condition, 1, conditionGetProfile.set).pipe(switchMap(m=>{
                data[index]['_totalStudent'] = m;
                return this.getTotalStudentByClass(data)
            }))
        }else{
            return of(data);
        }
    }

    onChangeClass(event) {
        this.classSelect_id = event['id'];
        this.getStudentByClass(event['id'], 1)
    }

    page: number = 1;
    listStudentByClass: ElngUserProfile[];
    recordsFiltered: number = 0;
    row: number = 20;

    changePage(event) {
        this.page = event.page + 1;

        this.getStudentByClass(this.classSelect_id, event.page + 1);
    }

    getStudentByClass(class_id: number, page: number) {
        this.page = page;
        const conditionGetProfile: ConditionOption = {
            condition: [
                // {conditionName: 'class_management_id', condition: OvicQueryCondition.equal, value: '0'},
                {conditionName:'class_management_id',condition:OvicQueryCondition.equal,value: class_id.toString()},
                {conditionName: 'teacher', condition: OvicQueryCondition.equal, value: '0'},
            ],
            page: this.page.toString(),
            set: [
                {label: 'limit', value: '20'},
                {label: 'orderby', value: 'name'},
                {label: 'order', value: 'ASC'},
            ]
        }
        // this.noitifi.isProcessing(true);
        this.noitifi.isProcessing(true);
        this.studentsService.getElngUserProfileByPageNew(conditionGetProfile.condition, page, conditionGetProfile.set).subscribe({
            next: ({data, recordsFiltered}) => {
                this.recordsFiltered = recordsFiltered;
                this.listStudentByClass = data.length > 0 ? data.map((m, index) => {
                    m['__index'] = index + 1;
                    return m;
                }) : [];
                this.noitifi.isProcessing(false);

            }, error: () => {
                this.noitifi.isProcessing(false);
                this.noitifi.toastError('Mất kết nối với máy chủ');
            }
        })
    }

    oncheckNameClass(listcheck: any[]): Observable<any[]> {
        const condition: ConditionOption = {
            condition: [
                {
                    conditionName: 'title',
                    condition: OvicQueryCondition.like,
                    value: listcheck.map(m => m.title).toString(),
                    orWhere: "in"
                }
            ], page: '1',
            set: [
                {label: 'select', value: 'id,title'},
                {label: 'limit', value: '-1'}
            ]
        }
        return this.classManagementService.getDataByPageNew(condition).pipe(map(m => m.data))
    }

    updateDuplicateNames(arrNew: any[], arrOld: any[]): any[] {
        const existingTitles = new Set(arrOld.map(o => o.title));

        return arrNew.map(item => {
            // Bỏ ký tự chữ cái in hoa cuối cùng
            const prefix = item.title.replace(/[A-Z]+$/, '');
            let counter = 1;
            let newTitle = item.title;

            while (existingTitles.has(newTitle)) {
                newTitle = prefix + this.numberToLetters(counter);
                counter++;
            }
            existingTitles.add(newTitle);
            return {...item, title: newTitle};
        });
    }

    async summitByTudong(arrnew: any[]) {
        const html = `<p>Xác nhận tạo lớp quản lý có tên là: <strong>${arrnew.map(m => m.title).join(', ')}</strong></p>`;
        const btn = await this.noitifi.confirmRounded(html, 'THÔNG BÁO', [BUTTON_YES, BUTTON_NO]);
        if (btn.name == 'yes') {
            this.noitifi.isProcessing(true);
            this.loopAddItem(arrnew).subscribe({
                next: () => {
                    this.closeForm();
                    this.noitifi.toastSuccess('Tạo mới thành công');
                    this.noitifi.isProcessing(false);
                    if(this.categoryFilter){
                        this.getDataKhoaAndNganh(this.categoryFilter);
                    }

                }, error: () => {
                    this.noitifi.isProcessing(false);
                    this.noitifi.toastError('Tạo mới không thành công');
                }
            })
        }
    }

    loopAddItem(arrnew: any[]): Observable<any[]> {
        const index = arrnew.findIndex(f => !f['isAdd']);
        if (index !== -1) {
            return this.classManagementService.add(arrnew[index]).pipe(switchMap(m => {
                    arrnew[index]['isAdd'] = true;
                    return this.loopAddItem(arrnew);
                }
            ))
        } else {
            return of(arrnew);
        }
    }
    onlyLetters(event: KeyboardEvent) {
        const pattern = /^[a-zA-Z]+$/;
        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault(); // chặn nhập
        }
    }


    onchageDonviByForm(event){
        const conditionNganh: ConditionOption = {
            condition: [
                {conditionName: 'donvi_chuyenmon_id', condition: OvicQueryCondition.equal, value: event['id'].toString()},
                {conditionName: 'type', condition: OvicQueryCondition.equal, value: 'nganh'},
                {conditionName: 'status', condition: OvicQueryCondition.equal, value: '1'},
            ],
            set: [
                {label: 'limit', value: '-1'},
            ],
            page: '1'
        }
        this.noitifi.isProcessing(true);
        this.categoriesService.getDataByPageNew(conditionNganh).pipe(map(m => m.data)).subscribe({
            next:(data)=>{
                this.noitifi.isProcessing(false);
                this.listNganhBoMonByForm = data;
            },error:()=>{
                this.noitifi.isProcessing(false);
                this.noitifi.toastError('Mất kết nối với máy chủ')
            }
        })

    }
    listNganhBoMonByForm: Category[] = [];
    classManagementSelect:ClassManagement ;

    //--------------------------------------------------------
    btnViewStudentByClassManagement(row:ClassManagement){
        this.classSelect_id = row.id
        this.classManagementSelect=row;
        this.getStudentByClass(row.id,1);
        this.noitifi.openSideNavigationMenu({template:this.formViewStudent,size:800,offsetTop: '0px' });
    }
    btnViewAddStudentByClass(row:ClassManagement){
        this.classSelect_id = row.id
        this.classManagementSelect=row;
        this.listStudentByFormAdd = [];
        this.noitifi.openSideNavigationMenu({template:this.formAddStudent,size:600,offsetTop: '0px' });
    }

    listStudentByFormAdd: ElngUserProfile[]  = [];
    searchStudent(event:string){

        this.noitifi.isProcessing(true);
        const conditionGetProfile: ConditionOption = {
            condition: [
                {conditionName: 'student_code', condition: OvicQueryCondition.like, value: `%${event}%`},
                // {conditionName:'class_management_id',condition:OvicQueryCondition.equal,value: this.classSelect_id.toString()},
                {conditionName: 'teacher', condition: OvicQueryCondition.equal, value: '0'},
            ],
            page: '1',
            set: [
                {label: 'limit', value: '-1'},
                {label: 'orderby', value: 'name'},
                {label: 'order', value: 'ASC'},
                {label:'select',value:'id,student_code,full_name,name,birthday,class_management_id,khoadaotao'}
            ]
        }
        this.studentsService.getElngUserProfileByPageNew(conditionGetProfile.condition, 1, conditionGetProfile.set).pipe(switchMap(m=>{
            const classManagementIds = Array.from(new Set(m.data.map(a=>a['class_management_id']).filter(f=>f['class_management_id'] !== 0)))

            const conditionGetLop: ConditionOption = {
                condition: [
                    {
                        conditionName: 'id',
                        condition: OvicQueryCondition.equal,
                        value: classManagementIds.toString(),
                        orWhere: 'in'
                    },
                ],
                set: [
                    {label: 'limit', value: '-1'},
                    {label: 'select', value: 'id,title,kyhieu'},
                ],
                page: '1'
            }

            return forkJoin([
                of(m.data),
                classManagementIds.length>0 ?this.classManagementService.getDataByPageNew(conditionGetLop).pipe(map(a=>a.data)):of([])
            ])
        })).subscribe({
            next:([studentBySearch,classManagement])=>{
                this.listStudentByFormAdd= studentBySearch.length>0 ? studentBySearch.map(m=>{
                    m['_tenlop'] = m['class_management_id'] !== 0 ? classManagement.find(f=>f.id === m.class_management_id).title :'' ;
                    return m;
                }) : [];
                this.noitifi.isProcessing(false);
            },error:()=>{
                this.noitifi.isProcessing(false);
                this.noitifi.toastError('Load dữ liệu không thành công');
            }
        })
    }

    async btnAddStudentByClass(item: ElngUserProfile ){
        if(item.class_management_id === this.classManagementSelect.id){
            this.noitifi.toastWarning('Sinh viên đã ở trong lớp quản lý ');
            return;
        }
         const html = item.class_management_id == 0 ?  `Thêm sinh viên vào lớp <strong>${this.classManagementSelect.title}</strong>` :
             ` <p>- Thay đổi lớp quản lý của sinh viên.</p>
                <p>- Lớp hiện tại <strong>${item['_tenlop']}</strong>, lớp cán bộ muốn đổi cho sinh viên <strong>${this.classManagementSelect.title}</strong>  </p>
             `;
        const btn = await this.noitifi.confirm(html,'THÔNG BÁO',[BUTTON_YES,BUTTON_NO]);

        if(btn.name =='yes'){
         this.noitifi.isProcessing(true);
         this.studentsService.updateElngUserProfile(item.id,{tenlop_quanly:this.classManagementSelect.title,class_management_id:this.classManagementSelect.id}).subscribe({
             next:(data)=>{
                 this.noitifi.isProcessing(false);
                 this.noitifi.toastSuccess('Thao tác thành công');

                 this.noitifi.closeSideNavigationMenu()
                 this.btnGetClassManagement()
             },error:()=>{
                 this.noitifi.isProcessing(false);
                 this.noitifi.toastError('Thao tác Không thành công');
             }

         })
        }
    }
    //-----------------------------------------------------------------
    btnEditRow(row:ClassManagement){
        this.classManagementSelect = row;
        console.log(row);

        this.formEdit.reset({
            nganh_id:row.nganh_id,
            khoa:row.khoa,
            donvi_id:row.donvi_id,
            title:row.title,
            kyhieu:row.kyhieu,
        })
        console.log(this.formEdit.value);
        this.noitifi.openSideNavigationMenu({
            template:this.formEditManagevent,
            name:'',
            size:600,
            offsetTop: '0px'
        })
    }
    saveFormEdit(){
        if(this.formEdit.valid){
            this.noitifi.isProcessing(true);
            this.classManagementService.update(this.classManagementSelect.id , this.formEdit.value).subscribe({
                next:()=>{

                    this.noitifi.isProcessing(false);
                    this.noitifi.toastSuccess('Cập nhật thành công');
                    this.closeForm();
                    this.btnGetClassManagement()
                },error:()=>{
                    this.noitifi.toastError('Thao tác không thành công');
                    this.noitifi.isProcessing(false);
                }
            })
        }else{
            this.noitifi.toastWarning('Vui lòng nhập đủ thông tin');
        }
    }
}
