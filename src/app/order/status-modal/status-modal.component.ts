import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';


@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {
  savingFlag: boolean = false;
  segment: any = {};
  category: any = {};
  login: any = {};
  delivery_from: any;
  userData: any;
  userId: any;
  userName: any;
  salesUser: any = [];
  organisationData: any = [];
  assignDistArray: any = [];
  drlist: any = [];
  tmpOrderStatus: any = '';
  segmentList: any = [];
  dr_data: any = [];
  states: any = [];
  today_date: any = new Date()
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<StatusModalComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.segment = this.data.segment;
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.delivery_from = this.data.delivery_from;
    console.log(data);
    this.tmpOrderStatus = this.data.order_status;
    console.log(this.tmpOrderStatus);
    if (this.tmpOrderStatus) {
      this.data.order_status = '';
      this.data.reason = '';
    }
  }

  ngOnInit() {
    if (this.delivery_from == 'assignDist') {
      this.distributorList('', this.data.state)
      this.distributorDetail();

    } else if (this.delivery_from == 'assignSales') {
      this.distributorDetail();
      this.getSalesUser('')
    }
    else if (this.delivery_from == 'subcategory-list') {
      this.data.segment_id = this.data.master_category_id.toString();
      this.getSegment();
    }
    else if (this.delivery_from == 'edit_travel_plan_retailer') {
      this.data.employee_id = this.data.employee_id.toString();
      this.data.id = this.data.travel_plan_id.toString();
      this.data.distributor_id = this.data.drId.toString();
      this.allCustomerNetworkList('');
    }
    else if (this.delivery_from == 'add_travel_plan_retailer') {
      this.data.employee_id = this.data.employee_id.toString();
      this.data.id = this.data.travel_plan_id.toString();
      this.allCustomerNetworkList('');

    }
    else if (this.delivery_from == 'month_wise_secondary_sale') {
      this.getStateList();

    }
    this.login = JSON.parse(localStorage.getItem('login'));
  }
  reason_reject: any
  primary_order_status_change(reason, status) {
    this.savingFlag = true;
    this.serve.post_rqst({ 'reason': reason, 'status': status, 'id': this.data.order_id, 'organisation_name': this.data.organisation_name, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Order/primaryOrderStatusChange").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }

    }))

  }
  secondary_order_status_change(reason, status) {
    this.savingFlag = true;
    this.serve.post_rqst({ 'reason': reason, 'status': status, 'id': this.data.order_id, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Order/secondaryOrderStatusChange").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }

  getSalesUser(searcValue) {
    this.serve.post_rqst({ 'search': searcValue }, "CustomerNetwork/salesUserList").subscribe((response => {
      if (response['statusCode'] == 200) {
        this.salesUser = response['all_sales_user'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
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

  distributorList(searcValue, state) {
    this.serve.post_rqst({ 'search': searcValue, 'state': state }, "CustomerNetwork/distributorsList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.drlist = result['distributors'];

      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  distributorDetail() {
    let id = { "id": this.data.drId }
    this.serve.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.data = result['distributor_detail'];
        this.data.id = result['distributor_detail']['id'];
        this.data.assigned_sales_user_name = this.data['assigned_sales_user_name'].map(String);
        this.data.distributor_id = this.data['distributors_id'].map(String);
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }
    )
  }


  allCustomerNetworkList(searcValue) {
    this.drlist = [];
    this.serve.post_rqst({ 'search': searcValue, 'type': this.data.drType, 'employee_id': this.data.employee_id }, "Travel/drList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.drlist = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }


  getSegment() {
    this.serve.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
      if (result['category_list']['statusCode'] == 200) {
        this.segmentList = result['category_list']['segment_list'];
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['category_list']['statusCode'])
      }
    }))
  }
  UpdateSalesUser() {
    this.savingFlag = true;
    setTimeout(() => {
      this.serve.post_rqst({ 'drId': this.data.id, 'userArray': this.data.assigned_sales_user_name, 'company_name': this.data.company_name }, "CustomerNetwork/drUserAssign").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.dialog.closeAll();
          this.savingFlag = false;
          this.toast.successToastr(result['statusMsg']);
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }, 2000);
  }
  // distArray(data){
  //   this.assignDistArray = []
  //   let index = this.drlist.findIndex(row => row.id == data)
  //   if(index != -1){
  //     this.assignDistArray.push(this.drlist[index].id)
  //   }
  // }
  UpdateDistributor() {
    this.savingFlag = true;
    this.serve.post_rqst({ 'drId': this.data.id, 'distributorId': this.data.distributor_id }, "CustomerNetwork/dealerDistributorAssign").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  UpdateCustomerNetworkTravel() {
    this.savingFlag = true;
    this.serve.post_rqst({ 'id': this.data.id, 'dr_id': this.data.distributor_id }, "Travel/drChange").subscribe((result => {
      if (result['statusCode'] == 200) {

        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  getDrType(networkData) {
    this.dr_data.push(networkData);
  }

  AddCustomerNetworkTravel() {
    this.savingFlag = true;
    this.serve.post_rqst({ 'id': this.data.id, 'drData': this.dr_data, }, "Travel/addDr").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  add_segment() {
    this.savingFlag = true;
    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    this.serve.post_rqst(this.data, "Master/addCategory").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
        this.serve.count_list();
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }

    }))

  }
  add_subCategory() {
    this.savingFlag = true;
    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    this.serve.post_rqst(this.data, "Master/addSubCategory").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true)
        this.serve.count_list();
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }))
  }

  downloadReport() {
    this.savingFlag = true;
    this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
    this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
    let apiName = '';
    if (this.delivery_from == 'tavel_plan') {
      apiName = "Travel/TravelPlanReport"
    }
    this.serve.post_rqst({ "date_from": this.data.date_from, "date_to": this.data.date_to }, apiName).subscribe((result: any) => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        window.open(this.serve.downloadUrl + result['filename'])
        // return true;
      } else {
        this.savingFlag = false;
      }
    }, () => this.savingFlag = false)
  }


  downloadsecondarySaleReport() {
    this.savingFlag = true;
    this.serve.post_rqst({ "filter": this.data }, 'Excel/monthWiseDealerSaleReport').subscribe((result: any) => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        window.open(this.serve.downloadUrl + result['filename'])
        // return true;
      } else {
        this.savingFlag = false;
      }
    }, () => this.savingFlag = false)
  }


  getStateList() {
    this.serve.post_rqst(0, "Influencer/getAllState").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }


}
