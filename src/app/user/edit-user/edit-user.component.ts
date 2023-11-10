
import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DesignationComponent } from '../designation/designation.component';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})

export class EditUserComponent implements OnInit {
  states: any = [];
  report_manager: any = [];
  data: any = {};
  district_list: any = [];
  user_type:any;
  sales_type: any = [];
  loader: boolean = false;
  module_name: any = [];
  exist: boolean = false;
  assign_module_data: any = [];
  userData: any;
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  maxDate: any;
  branch: any = [];
  brandList: any = [];
  organisationData: any = [];
  warehouse: any = [];
  multiple_district_list: any=[];

  constructor(public serve: DatabaseService,
    public dialog1: MatDialog,
    private route: ActivatedRoute,
    public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent) {
    this.maxDate = new Date();
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.getStateList();
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.loader = true;
        this.userDetail();
        this.getReportManager('');
      }
    });
  }

  getStateList() {
    this.serve.post_rqst(0, "Master/getAllState").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
        this.states.map((row) => { row.state_name = row.state_name.toUpperCase(); })
        // this.data.district=''
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  userDetail() {
    this.serve.post_rqst({ 'id': this.userId }, "Master/salesUserDetail").subscribe((result) => {
      this.loader = false;
      this.data = result['sales_detail'];

      if (this.data.date_of_joining == '0000-00-00') {
        this.data.date_of_joining = '';
      }
      this.getStateList();
      this.getBrand();
      this.get_sales_user_type(this.data.user_type, '');

      this.data.state = this.data.state_name;
      if (this.data.state_name != '') {
        this.getDistrict(1);
      }
      this.data.district = this.data.district_name
      // this.getDistrict(1);
      this.data.rsm_id = this.data.rsm_id.toString();
      this.data.role_id = this.data.designation_id.toString();
      this.data.brand = this.data.brand.map(String);
      this.data.assign_system_user = this.data.assign_system_user_id.map(String);
      this.data.working_state = this.data.working_state_name;
      this.multipleDistrict(this.data.working_state);
      this.data.working_district = this.data.working_district;
      
      this.data.zonal_manager = this.data.zonal_manager.toString();
      this.data.zonal_manager.toUpperCase();

      this.data.working_state.map((row, i) => { this.data.working_state[i] = row.toUpperCase(); })

      if (this.data.user_type == 'System User') {
        this.assign_module_data = this.data.assign_module;
      }

      if (this.data.role_id == '53' || this.data.role_id == '54' || this.data.role_id == '58' || this.data.role_id == '59') {
        this.getCompanyData();
        this.data.assign_company = this.data.assign_company.toString();
      }

      if (this.data.warehouse_id != '') {
        this.data.warehouse_id = this.data.warehouse_id.toString()
      }
      if (this.data.dispatch_type != '') {
        this.getWarehouse();
      }

      if (this.data.assign_system_user != '') {
        this.getReportManager('');
      }
      if (this.data.date_of_joining == '0000-00-00') {
        this.data.date_of_joining = '';
      }
      if (this.data.state_name != '') {
        this.getDistrict(1);
      }
      this.get_sales_user_type(this.data.user_type, '');
    })
  }


  multipleDistrict(list){
    if(list.length>0)
    {
      this.serve.post_rqst({ 'state_name': list }, "Master/multiple_district").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.multiple_district_list = result['all_district'];
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
   
  }

  getWarehouse() {
    this.serve.post_rqst({}, "Dispatch/fetchWarehouse").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.warehouse = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }

  getCompanyData() {
    this.serve.post_rqst({}, "Order/organizationName").subscribe((response => {
      if (response['statusCode'] == 200) {
        this.organisationData = response['result'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }

    }));
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

  }



  getBrand() {
    this.serve.post_rqst({}, "Master/brandList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.brandList = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  check_number() {
    if (this.data.contact_01.length == 10) {
      this.serve.post_rqst({ "mobile": this.data.contact_01 }, "Master/userMobileNoCheck").subscribe((result => {
        if (result['statusCode'] == 200) {
          if (result['statusMsg'] != 'Not Exist') {
            this.exist = true;
            this.toast.errorToastr(result['statusMsg'])
          }
          else {
            this.exist = false;
          }
        }
        else {
          this.exist = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
  }

  getDistrict(val) {
    let st_name;
    if (val == 1) {
      if (this.data.state_name!='' && this.data.state_name) {
        st_name = this.data.state_name;
      }
      else{
        st_name = this.data.state;

      }
    }
    this.serve.post_rqst({ 'state_name': st_name }, "Master/getAllDistrict").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.district_list = result['all_district'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  get_sales_user_type(type, event) {
    let Usertype

    if (type != '') {
      Usertype = type;
    }
    else {
      Usertype = event.value
    }
    this.serve.post_rqst({ 'user_type': Usertype }, "Master/getDesignation").subscribe((response => {
      this.sales_type = response['all_designation'];
      // console.log(this.sales_type);




    }));
  }

  getReportManager(searcValue) {
    this.serve.post_rqst({ 'search': searcValue, 'id': this.userId }, "Master/getSalesUserForReporting").subscribe((result => {
      if (result['all_sales_user']['statusCode'] == 200) {
        this.report_manager = result['all_sales_user']['all_sales_user'];
      }
      else {
        this.toast.errorToastr(result['all_sales_user']['statusMsg'])
      }
    }));
  }


  submitDetail() {

    if(this.data.user_type!='Service Engineer'){
    if (this.data.role_id) {
      let index = this.sales_type.findIndex(d => d.id == this.data.role_id);
      if (index != -1) {
        this.data.role_name = this.sales_type[index].role_name
      }
    }
    if (this.data.date_of_joining) {
      this.data.date_of_joining = moment(this.data.date_of_joining).format('YYYY-MM-DD');
      this.data.date_of_joining = this.data.date_of_joining;
    }
    if (this.data.user_type == 'System User') {
      this.data.assignModule = this.assign_module_data;
    }
    this.data.uid = this.userId;
    this.data.user_id = this.userId;
    this.data.uname = this.userName;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.data }, "Master/updateUser").subscribe((response => {
      if (response['statusCode'] == "200") {
        this.toast.successToastr(response['statusMsg']);
        this.rout.navigate(['/sale-user-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  else{
    //  this.data.uid = this.userId;
    this.data.user_id = this.userId;
    this.data.uname = this.userName;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.data }, "Master/updateUser").subscribe((response => {
      if (response['statusCode'] == "200") {
        this.toast.successToastr(response['statusMsg']);
        this.rout.navigate(['/sale-user-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  }

  // get_module_data() {
  //   this.serve.post_rqst(0, "Master/moduleMasterList").subscribe((response => {
  //     this.assign_module_data = response['result'];
  //   }));

  // }

  assign_module(module_name, event, index) {
    if (event.checked) {
      this.assign_module_data[index][module_name] = 'true';
    }
    else {
      this.assign_module_data[index][module_name] = 'false';
    }
  }


  back(): void {
    this.location.back()
  }

  openDialog(): void {
    const dialogRef = this.dialog1.open(DesignationComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'type': 'designation'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.get_sales_user_type(this.data.user_type, '')
      }

    });
  }
}
