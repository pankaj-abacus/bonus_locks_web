import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../../dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GatepassAddComponent } from '../gatepass-add/gatepass-add.component';



@Component({
  selector: 'app-company-dispatch-list',
  templateUrl: './company-dispatch-list.component.html'
})



export class CompanyDispatchListComponent implements OnInit {
  active_tab = 'Pending Dispatch';
  excelLoader: boolean = false;
  total_list: any
  value: any = {};
  distributor_list: any = [];
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  loader: boolean = false;
  data: any = [];
  type: any;
  filter: any = {};
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {}
  today_date: Date;
  add: any = {};
  assign_login_data2: any = [];
  all_count: any = {}
  assign_login_data: any = [];
  loginData: any;
  date: any;
  downurl:any ='';
  gatePassAssign:any =[];
  gatePassUnassign:any =[];
  pendingDispatchCount:any;
  dispatchCount:any;
  returnData:any =[];
  dispatchGatepassCount: any;
  pendingGatepassCount: any;
  organisationData:any =[];
  organizationFlag:boolean = false;

  constructor(public serve: DatabaseService, public route: Router, public ActivatedRoute: ActivatedRoute,
    public dialog: DialogComponent, public session: sessionStorage, public alrt: MatDialog,public toast :ToastrManager) {
      this.downurl = serve.downloadUrl;
      this.page_limit = serve.pageLimit;
      this.today_date = new Date();
      this.assign_login_data = this.session.getSession();
      this.loginData = this.session.getSession();
      this.loginData = this.loginData.value;
      this.loginData = this.loginData.data;
      this.assign_login_data = this.assign_login_data.value;
      this.assign_login_data2 = this.assign_login_data.data;
      this.date = new Date();
      this.assign_login_data = this.assign_login_data.assignModule;
    }
    
    ngOnInit() {
      this.filter = this.serve.getData()
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value.data;
      this.skelton = new Array(10);
      if (this.login_data.access_level != '1') {
        this.login_dr_id = this.login_data.id;
      }
      
      // this.ActivatedRoute.params.subscribe(params => {
      //   this.type_id = params.id;
      //   this.type = params.type;
      // });
      
    }
    ngAfterViewInit(){
      if(this.assign_login_data2.id != '1' &&  this.assign_login_data2.view_dispatch_packing== '1' && this.assign_login_data2.add_dispatch_packing== '1'){
        this.active_tab = 'Pending Dispatch';
      }
      if(this.assign_login_data2.id != '1' && this.assign_login_data2.view_dispatch_billing== '1' && this.assign_login_data2.add_dispatch_billing== '1'){
        this.active_tab = 'Dispatched';
      }
      if(this.assign_login_data2.id != '1' && this.assign_login_data2.view_dispatch_guard== '1' && this.assign_login_data2.add_dispatch_guard== '1'){
        this.active_tab = 'Pending Gatepass';
      }
      if (this.filter.active_tab && (this.filter.active_tab=='Pending Gatepass' || this.filter.active_tab=='Dispatch Gatepass')) {
        this.active_tab = this.filter.active_tab
        this.getGeatePass('');
      }
      else if(this.filter.active_tab && (this.filter.active_tab=='Pending Dispatch' || this.filter.active_tab=='Dispatched')){
        this.active_tab = this.filter.active_tab
        this.billData('');
      }
      else if((this.assign_login_data2.view_dispatch_packing== '1' && this.assign_login_data2.add_dispatch_packing== '1' || this.assign_login_data2.view_dispatch_billing== '1' && this.assign_login_data2.add_dispatch_billing== '1') && (this.active_tab=='Pending Dispatch' || this.active_tab=='Dispatched')){
        this.billData('');
      }

      else if((this.assign_login_data2.view_dispatch_guard== '1' && this.assign_login_data2.add_dispatch_guard== '1') && (this.active_tab=='Pending Gatepass' || this.active_tab=='Dispatched Gatepass')){
        this.getGeatePass('');
      }
      else{

        this.billData('');
      }
    }
    
    
    
    pervious(active_tab) {
      this.start = this.start - this.page_limit;
      
      if(active_tab == 'Dispatch Gatepass' || active_tab=='Pending Gatepass'){
        this.getGeatePass('');
      }
      else if(active_tab == 'Sales Retun'){
        this.getSalesReturn('');
      }
      else{
        this.billData('');
      }
    }
    
    nextPage(active_tab) {
      
      this.start = this.start + this.page_limit;
      if(active_tab == 'Dispatch Gatepass' || active_tab=='Pending Gatepass'){
        this.getGeatePass('');
      }
      else if(active_tab == 'Sales Retun'){
        this.getSalesReturn('');
      }
      else{
        this.billData('');
      }
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
  
    
    
    
    
    billData(action: any = '') {
      this.loader = true;
      
      if (action == "refresh") {
        this.filter = {};
        this.distributor_list = [];
        this.start = 0;
      }
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      
      if (this.start < 0) {
        this.start = 0;
      }
      
      if(this.filter.date_created){
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      if(this.filter.billing_date){
        this.filter.billing_date = moment(this.filter.billing_date).format('YYYY-MM-DD');
      }
      
      this.filter.active_tab = this.active_tab;
      this.organizationFlag = false;
      this.serve.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit}, "Dispatch/tallyInvoiceCreditBillingListing")
      .subscribe((result => {
        if(result['statusCode']==200){
          this.distributor_list = (result['credit_billing_list']);
          this.dispatchCount = result['dispatch'];
          this.pendingDispatchCount = result['pendingDispatch'];
          this.getCompanyData();
          
          this.loader = false;
          if(this.active_tab == 'Pending Dispatch'){
            this.pageCount = result['pendingDispatch'];
          }
          if(this.active_tab == 'Dispatched'){
            this.pageCount = result['dispatch'];
          }
    
          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          
          this.serve.count_list();
        }else{
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    
    gate_pass_list:any =[];
    getGeatePass(action: any = '') {
      if (action == "refresh") {
        this.filter = {};
        this.gate_pass_list = [];
        this.start = 0;
      }
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      
      if (this.start < 0) {
        this.start = 0;
      }
      if(this.filter.date_created){
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      this.loader = true;
      this.filter.active_tab = this.active_tab;
      this.serve.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit}, "Dispatch/getGatePassList")
      .subscribe((result => {
        if(result['statusCode']==200){
          this.gate_pass_list = (result['result']);
          this.pendingGatepassCount = result['pendingGatepass'];
          this.dispatchGatepassCount = result['dispatchGatepass']
          
          this.loader = false;
          if(this.active_tab == 'Pending Gatepass' || this.active_tab == 'Dispatch Gatepass'){
            this.pageCount = result['count'];
          }
          // if(this.active_tab == 'Dispatch Gatepass'){
          //   this.pageCount = result['dispatchGatepass'];
          // }
          this.total_list = (result['overall_total_sum']);
          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          this.serve.count_list();
        }else{
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    getSalesReturn(action: any = '') {
      if (action == "refresh") {
        this.filter = {};
        this.gate_pass_list = [];
        this.start = 0;
      }
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      
      if (this.start < 0) {
        this.start = 0;
      }
      if(this.filter.date_created){
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      this.loader = true;
      this.filter.active_tab = this.active_tab;
      this.serve.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit}, "Dispatch/getSalesReturnList")
      .subscribe((result => {
        if(result['statusCode']==200){
          this.returnData = result['result'];
          this.loader = false;
          this.pageCount = result['count'];
          this.total_list = (result['overall_total_sum']);
          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          this.serve.count_list();
        }else{
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    
    
    
    select_item(event,indx)
    {        


      if(!this.filter.organisation_name && event.checked){
        this.toast.errorToastr('Please select organization filter');
        this.organizationFlag = true;
        return
      }

      if(event.checked)
      {
        this.gatePassAssign.push(this.distributor_list[indx]);
        let idx = this.gatePassUnassign.findIndex(row => row.id == this.distributor_list[indx].id);
        this.gatePassUnassign.splice(idx,1);
      }
      else
      {
        let idx = this.gatePassAssign.findIndex(row => row.id == this.distributor_list[indx].id);
        this.gatePassAssign.splice(idx,1);
        this.gatePassUnassign.push(this.distributor_list[indx]);
        this.organizationFlag = false;
      }
    }
    
    
    
    openDialog(type, number): void {  
      const dialogRef = this.alrt.open(GatepassAddComponent, {
        width: '1024px',
        panelClass:'cs-modal',
        disableClose: true,
        data:{
          'model_type':type,
          'gatePassAssign':this.gatePassAssign,
          'invoice_number':number,
        }
        
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          this.billData('');
          this.gatePassAssign = [];
        }
      });
    }
    
    
    getDetails(id, type): void {  
      const dialogRef = this.alrt.open(GatepassAddComponent, {
        width: '1024px',
        panelClass:'cs-modal',
        disableClose: true,
        data:{
          'model_type':type,
          'gatepass_id':id,
        }
        
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          this.getGeatePass('');
        }
      });
    }
    

    
    
    
    refresh(blnk, active_tab) {
      this.start = 0;
      this.filter={};
      this.organizationFlag = false;
      if(active_tab == 'Dispatch Gatepass' || active_tab=='Pending Gatepass'){
        this.getGeatePass('');
      }
      else if(active_tab == 'Sales Retun'){
        this.getSalesReturn('');
      }
      else{
        this.billData('');
      }
      this.gatePassAssign=[]
    }
    
    
    downloadExcel(){
      this.serve.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter,}, "Excel/salesReturnCsv").subscribe((result => {
        if(result['msg'] == true){
          window.open(this.downurl + result['filename'])
        }else{
        }
      }));
    }
    print_process_scanning(id){
    this.route.navigate(['/gatepass-scanning/'+id])

    }
    
  }
  
  