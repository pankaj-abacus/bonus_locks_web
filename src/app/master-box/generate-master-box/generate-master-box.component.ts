import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ViewMasterBoxDispatchDetailComponent } from 'src/app/company-dispatch/view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-generate-master-box',
  templateUrl: './generate-master-box.component.html',
  styleUrls: ['./generate-master-box.component.scss']
})
export class GenerateMasterBoxComponent implements OnInit {

  id:any;
  couponNumber:any= {};
  filter: any = {};
  data:any ={};
  product_data: any = []
  masterboxData:any=[];
  invoice_detail:any={}
  masterdispatchboxitemdetail:any=[];
  skLoading:boolean = false;
  gatePassAssign:any =[]; 
  billing_list:any=[];
  dispatch_detail:any ={};
  payment_list:any=[];
  dispatch_coupon:any=[];
  dispatchItem:any =[];
  dispatchQTY:any = 0;
  dispatchInvoice:any = 0;
  dispatch_status:any ='Pending';
  couponList:any =[];
  temCoupon:any =[];
  dispatchedCoupon:any ={};




  constructor(
    public route:ActivatedRoute,
    public rout: Router,
    public service:DatabaseService,
    public toast:ToastrManager,
    public dialog: MatDialog,
    public dialogs:DialogComponent
    ) { }

  ngOnInit() {
    this.getmasterbox('')
    this.getdispatchMasterboxdetail()
  }

  findProductId(code) {
    let index = this.product_data.findIndex(row => row.product_code == code)
    if (index != -1) {
      this.data.product_id = this.product_data[index].product_id;
      this.data.product_name = this.product_data[index].product_name;
      this.data.sku_code = this.product_data[index].sku_code;
      this.data.mrp = this.product_data[index].mrp;
      this.data.qty = this.product_data[index].qty;
      this.data.point_category_id = this.product_data[index].point_category_id;
      this.data.point_category_name = this.product_data[index].point_category_name;
      this.data.uom = this.product_data[index].uom;
      this.data.small_packing_size = this.product_data[index].small_packing_size;
    }
  }
 
  getdispatchMasterboxdetail(){
    this.service.post_rqst({'data':data},'Dispatch/fetchMasterGrandCouponNew').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.masterdispatchboxitemdetail=result['master_grand_coupon']             
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        // this.couponNumber =  {};
      }
    });
  }

  checkCoupon(number,couponGrandMasterId)
  {
    if(number.length == 16){
      if(number == undefined){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if(number == ''){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      
      if(this.temCoupon != '')
      {
        let temData = number;
        let index = this.temCoupon.findIndex(row => row.coupon_no == temData);
        if (index != -1) {
          if(this.temCoupon[index].coupon_no === temData){
            this.couponNumber.coupon_number ='';
            this.toast.errorToastr('Coupon code already exists');
            this.clearValue();
            return
          }
          else{
            this.couponNumber.coupon_number ='';
            this.clearValue();
          }
        }
        else{
          this.couponNumber.coupon_number ='';
          this.clearValue();
          // this.temCoupon.push({'coupon_no':number, 'status':'Pending', 'product_detail':''});
          this.dispatchItems(number,couponGrandMasterId);
          
        }
      }
      else{
        this.couponNumber.coupon_number ='';
        this.clearValue();
        // this.temCoupon.push({'coupon_no':number, 'status':'Pending'});
        this.dispatchItems(number,couponGrandMasterId);
      }
      
    }
  }

  getdispatchDetail(){
    this.dispatchItem =[];
    this.service.post_rqst({'invoice_id':this.id, 'invoice_no':this.invoice_detail.order_no},'Dispatch/checkCouponCodeCheckNew').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.dispatchQTY= result['sale_dispatch_qty'];
        this.dispatchInvoice= result['invoice_qty'];
        
        if(this.dispatchQTY == this.dispatchInvoice){
          this.dispatch_status = 'Dispatched';
        };  
        for (let i = 0; i < result['dispatch']['dispatch_item'].length; i++) {
          this.dispatchItem.push({'item_code':result['dispatch']['dispatch_item'][i]['item_code'], 'sale_qty':result['dispatch']['dispatch_item'][i]['sale_qty'], 'remaining_qty':result['dispatch']['dispatch_item'][i]['sale_qty'], 'item_name':result['dispatch']['dispatch_item'][i]['item_name'], 'sale_dispatch_qty':result['dispatch']['dispatch_item'][i]['sale_dispatch_qty'], 'id':result['dispatch']['dispatch_item'][i]['id'], 'dispatch_qty':0, })
        }
        if(this.dispatchItem.length == 0){
          this.rout.navigate(['company-dispatch']);
        }
        this.couponNumber.coupon_number ='';
      }
      else{
        this.couponNumber.coupon_number ='';
        this.toast.errorToastr(result['statusMsg']);
      }
    });
  }

  dispatchItems(number,couponGrandMasterId){
    this.dispatchItem = [];
    this.service.post_rqst({'coupon_code':number,'product_id':this.data.product_id,'bill_dispatch_type':this.invoice_detail.bill_dispatch_type, 'dr_code':this.invoice_detail.dr_code, 'created_by_name':this.data.created_by_name, 'created_by_id':this.data.created_by_id, 'company_name':this.invoice_detail.company_name,  'invoice_id':this.id, 'invoice_no':this.invoice_detail.order_no,'couponGrandMasterId':couponGrandMasterId},'Dispatch/checkCouponCodeCheckNew').subscribe((result)=>
    {
      if (result['statusCode'] == 200 && result['case'] == ''){
        this.temCoupon.push(result['coupon_details'])
        console.log(this.temCoupon);
      }
      else{
        this.toast.errorToastr(result['case']);
      }
      // if (result['statusCode'] == 200){
      //   this.dispatchedCoupon= result['coupon_code'];
      //   this.dispatchQTY= result['sale_dispatch_qty'];
      //   this.dispatchInvoice= result['invoice_qty'];
      //   this.dispatchItem = result['dispatch'];
        
      //   console.log(this.dispatchItem, 'this.dispatchItem');
        
        
      //   if(this.dispatchedCoupon){
      //     for (let i = 0; i < this.temCoupon.length; i++) {
      //       if(this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon){
      //         if(result['statusMsg'] != 'Success' ){
      //           this.toast.errorToastr(result['statusMsg']);
      //         }
              
      //         this.temCoupon[i]['status']  = result['statusMsg'];
      //         this.temCoupon[i]['product_detail']  = result['product_detail'];
      //         // this.billDatadetail()
      //       }
      //     }
      //   }
        
      // }
      // else{
      //   if(result['coupon_code']){
      //     this.dispatchedCoupon= result['coupon_code'];
      //     for (let i = 0; i < this.temCoupon.length; i++) {
      //       if(this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon){
      //         if(result['statusMsg'] != 'Success' ){
      //           this.toast.errorToastr(result['statusMsg']);
      //         }
      //         this.temCoupon[i]['status']  =result['statusMsg'];
      //         this.temCoupon[i]['product_detail']  = result['product_detail'];
      //       }
      //     }
      //     this.couponNumber.coupon_number='';
      //     // this.billDatadetail()
      //   }
      //   else{
      //     if(result['statusMsg'] == 'Coupon not exist.'){
      //       for (let i = 0; i < this.temCoupon.length; i++) {
      //         if(this.temCoupon[i]['coupon_no'] == number){
      //           this.temCoupon[i]['status'] = result['statusMsg'];
      //           this.temCoupon[i]['product_detail']  = result['product_detail'];
      //         }
      //       }
      //       this.couponNumber.coupon_number='';
      //     }
      //     this.toast.errorToastr(result['statusMsg']);
      //   }
      // }
      this.couponNumber.coupon_number='';
      this.getmasterbox('')
      this.getdispatchMasterboxdetail()
    }) 
  }
  clearValue(){
    this.couponNumber.coupon_number ='';
  }

  dispacthItemDetail(){
    this.service.post_rqst({'invoice_id':this.id, 'invoice_no':this.invoice_detail.order_no},'Dispatch/dispatchedCouponList').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.couponList= result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }) 
  }
  addGrandmasterboxes(){
    let data = {'total_coupon':1}
    this.service.post_rqst({'data':data},"Dispatch/genrateMasterGrandCouponNew").subscribe((result)=>{
      
      if(result['statusCode']==200)
      {
        // this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
        this.getmasterbox('')
        this.getdispatchMasterboxdetail()
      }else{
        // this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  getmasterbox(searcValue) {
    this.filter.coupon_code =searcValue;
    this.service.post_rqst({}, 'Dispatch/fetchMasterGrandCouponDropdownNew').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.masterboxData = resp['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  deletemasterboxes(data,number){
    this.dialogs.confirm("Delete Master Box?").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data':data }, 'Dispatch/deleteGrandMasterBox').subscribe((resp) => {
          if (resp['statusCode'] == 200) {
            this.toast.successToastr('Deleted Successfully..');              
            this.getdispatchMasterboxdetail();
          }
          else {
            this.toast.errorToastr(resp['statusMsg']);
            return;
          }
        }, error => {
        })
      }
    })
  }
  viewmasterboxdetail(maindata,type){
    let data={'main_data':maindata,'type':type}
    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent,{
      width:'1000px',
      data
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        // this.billDatadetail();
      }
      
    }); 
  }
  getProduct(searcValue) {
    this.filter.coupon_type = 'both';
    this.filter.product_name = searcValue;
    this.service.post_rqst({ 'filter': this.filter }, 'CouponCode/productListNew').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.product_data = resp['data'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
 

}
