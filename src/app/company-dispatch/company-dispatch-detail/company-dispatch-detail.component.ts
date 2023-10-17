import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddGrandMasterBoxComponent } from '../add-grand-master-box/add-grand-master-box.component';
import { ViewMasterBoxDispatchDetailComponent } from '../view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { GatepassAddComponent } from '../gatepass-add/gatepass-add.component';

@Component({
  selector: 'app-company-dispatch-detail',
  templateUrl: './company-dispatch-detail.component.html'
})
export class CompanyDispatchDetailComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;


  elementType: any = ''
  orderType: any = 'order';
  id: any;
  data: any = {};
  search: any = {}
  couponNumber: any = {};
  savingFlag: boolean = false;
  userData: any;
  invoice_detail: any = {}
  billing_list: any = [];
  dispatchItem: any = [];
  payment_list: any = [];
  masterboxData: any = [];
  masterdispatchboxitemdetail: any = [];
  masterboxDataforsearch: any = [];
  mainmasterboxDisable: boolean = false;
  dispatch_detail: any = {};
  skLoading: boolean = false;
  filter: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  printdata: any = [];
  organisation_name: any;
  cartennumber: any;
  gatePassAssign: any = [];
  assign_login_data2: any = {};
  product_data: any = []
  loader: boolean = false;

  couponList: any = [];
  temArray: any = [];
  dispatchQTY: any = 0;
  dispatchInvoice: any = 0;
  dispatch_status: any = 'Pending';
  start: any = 0;
  page_limit: any;
  total_page: any = 0;
  pagenumber: any = 0;
  pageCount: any;
  sr_no: number;
  temCoupon: any = [];
  dispatchedCoupon: any;

  constructor(public route: ActivatedRoute, public service: DatabaseService, public rout: Router,
    public apiHit: DatabaseService,
    public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public toast: ToastrManager,) {

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id = this.userData['data']['id'];
    this.data.created_by_name = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.assign_login_data2 = this.assign_login_data.data;
    this.page_limit = 10;

    this.route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {
    this.billDatadetail()
    this.getmasterboxnew('')
  }

  ngAfterViewInit() {
  }

  setcouponnoFocused() {
    this.inputEl.nativeElement.focus();

  }
  billDatadetail() {
    this.skLoading = true;
    this.invoice_detail = '';
    this.service.post_rqst({ 'bill_id': this.id }, "Dispatch/tallyInvoiceCreditBillingDetail")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.invoice_detail = result['order'];
          this.gatePassAssign.push(this.invoice_detail);
          this.dispatch_detail = result['dispatch_data'];
          this.billing_list = result['order_item'];

          if (this.invoice_detail.order_status == 'Dispatched') {
            this.dispacthItemDetail();
          }
          this.getdispatchMasterboxdetail();
          // this.getmasterbox('', this.invoice_detail.order_no);
          // for (let i = 0; i < this.billing_list.length; i++) {
          //   this.dispatchItem.push({'item_code':this.billing_list[i]['product_code'], 'sale_qty':this.billing_list[i]['qty'], 'remaining_qty':this.billing_list[i]['qty'], 'item_name':this.billing_list[i]['product_name'], 'dispatch_qty':0, })
          // }
          this.payment_list = result['payment_list'];
          this.dispatchItems('', '');
          this.skLoading = false;
          this.service.count_list();
          this.couponNumber.coupon_number = '';
        } else {
          this.skLoading = false;
          this.service.count_list();
          this.toast.errorToastr(result['statusMsg'])
          this.couponNumber.coupon_number = '';
        }
      }))
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.getdispatchMasterboxdetail();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getdispatchMasterboxdetail();
  }

  openDialog(type, number): void {
    const dialogRef = this.dialog.open(GatepassAddComponent, {
      width: '1024px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'model_type': type,
        'gatePassAssign': this.gatePassAssign,
        'invoice_number': number,
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {

      }
    });
  }

  checkCoupon(number, couponGrandMasterId) {
    if (number.length == 16) {
      if (number == undefined) {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if (number == '') {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }

      if (this.temCoupon != '') {
        let temData = number;
        let index = this.temCoupon.findIndex(row => row.coupon_no == temData);
        if (index != -1) {
          if (this.temCoupon[index].coupon_no === temData) {
            this.couponNumber.coupon_number = '';
            this.toast.errorToastr('Coupon code already exists');
            this.clearValue();
            return
          }
          else {
            this.couponNumber.coupon_number = '';
            this.clearValue();
          }
        }
        else {
          this.couponNumber.coupon_number = '';
          this.clearValue();
          this.temCoupon.push({ 'coupon_no': number, 'status': 'Pending', 'product_detail': '' });
          this.dispatchItems(number, couponGrandMasterId);

        }
      }
      else {
        this.couponNumber.coupon_number = '';
        this.clearValue();
        this.temCoupon.push({ 'coupon_no': number, 'status': 'Pending' });
        this.dispatchItems(number, couponGrandMasterId);
      }

    }
  }

  storeData: any = [];
  dispatchItems(number, couponGrandMasterId) {
    this.service.post_rqst({ 'coupon_code': number, 'dispatch_status': this.dispatch_status, 'bill_dispatch_type': this.invoice_detail.bill_dispatch_type, 'warehouse_id': this.invoice_detail.warehouse_id, 'dr_id': this.invoice_detail.dr_id, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.invoice_detail.company_name, 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no, 'couponGrandMasterId': couponGrandMasterId }, 'Dispatch/checkCouponCodeCheck').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.dispatchItem = [];
        if (result['coupon_code'] != undefined) {
          this.dispatchedCoupon = result['coupon_code'];
        }
        this.dispatchQTY = result['sale_dispatch_qty'];
        this.dispatchInvoice = result['invoice_qty'];
        this.storeData = result['dispatch'];
        if (this.storeData.length > 0) {
          for (let i = 0; i < this.storeData.length; i++) {
            this.dispatchItem.push({ 'product_code': this.storeData[i]['product_code'], 'sale_qty': this.storeData[i]['sale_qty'], 'remaining_qty': this.storeData[i]['sale_qty'], 'product_name': this.storeData[i]['product_name'], 'sale_dispatch_qty': this.storeData[i]['sale_dispatch_qty'], 'id': this.storeData[i]['id'], 'dispatch_qty': 0, })
          }
        }
        this.refresh();

        if (this.dispatchedCoupon) {
          for (let i = 0; i < this.temCoupon.length; i++) {
            if (this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon) {
              this.temCoupon[i]['status'] = result['statusMsg'];
              console.log(this.temCoupon[i]['status'], 'status 250');

              this.temCoupon[i]['product_detail'] = result['product_detail'];

              if (result['statusMsg'] != 'Success') {
                this.toast.errorToastr(result['statusMsg']);
              }


              // this.billDatadetail()
            }
          }
        }

        if (parseInt(this.dispatchQTY) == parseInt(this.dispatchInvoice) && this.invoice_detail.order_status == 'readyToDispatch') {
          this.rout.navigate(['company-dispatch']);
        }

        this.getmasterbox('', this.invoice_detail.order_no)

      }
      else {

        console.log(this.dispatchedCoupon, 'this.dispatchedCoupon');

        if (result['coupon_code']) {
          this.dispatchedCoupon = result['coupon_code'];
          for (let i = 0; i < this.temCoupon.length; i++) {
            if (this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon) {
              this.temCoupon[i]['status'] = result['statusMsg'];
              console.log(this.temCoupon[i]['status'], 'status 269');
              this.temCoupon[i]['product_detail'] = result['product_detail'];
              if (result['statusMsg'] != 'Success') {
                this.toast.errorToastr(result['statusMsg']);
              }

            }
          }
          this.couponNumber.coupon_number = '';


        }
        else {
          if (result['statusMsg'] == 'Coupon not exist.') {
            for (let i = 0; i < this.temCoupon.length; i++) {
              if (this.temCoupon[i]['coupon_no'] == number) {
                this.temCoupon[i]['status'] = result['statusMsg'];
                console.log(this.temCoupon[i]['status'], 'status 285');

                this.temCoupon[i]['product_detail'] = result['product_detail'];
              }
            }
            this.couponNumber.coupon_number = '';
          }
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      this.couponNumber.coupon_number = '';
    })
  }


  clearValue() {
    this.couponNumber.coupon_number = '';
  }



  refresh() {
    this.start = 0;
    this.filter = {};
    this.getdispatchMasterboxdetail();
  }


  getdispatchMasterboxdetail() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.service.post_rqst({ 'data': { 'invoice_id': this.id, 'bill_number': this.invoice_detail.order_no, 'start': this.start, 'pagelimit': this.page_limit }, 'filter': this.filter, }, 'Dispatch/fetchMasterGrandCoupon').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.masterdispatchboxitemdetail = result['master_grand_coupon'];
        this.loader = false;
        this.pageCount = result['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
        // this.couponNumber =  {};
      }
    });
  }
  dispacthItemDetail() {
    this.service.post_rqst({ 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no }, 'Dispatch/dispatchedCouponList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.couponList = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }

  addGrandmasterboxes(bill_number, id, type) {
    let data = { 'bill_number': bill_number, 'id': id, 'total_coupon': 1 }
    this.service.post_rqst({ 'data': data }, "Dispatch/genrateMasterGrandCoupon").subscribe((result) => {

      if (result['statusCode'] == 200) {
        // this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
        this.billDatadetail();
      } else {
        // this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    })


  }
  getmasterbox(searcValue, bill_number) {
    this.filter.coupon_code = searcValue;
    this.service.post_rqst({ 'data': { 'filter': this.filter, 'invoice_id': this.id, 'bill_number': bill_number } }, 'Dispatch/fetchMasterGrandCouponDropdown').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.masterboxData = resp['master_grand_coupon'];
        this.temCoupon = [];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  getmasterboxnew(searcValue) {
    this.filter.coupon_code = searcValue;
    this.service.post_rqst({ 'search': searcValue }, 'Dispatch/fetchMasterGrandCouponDropdownNew').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.masterboxDataforsearch = resp['master_grand_coupon'];
        this.temCoupon = [];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  viewmasterboxdetail(maindata, type) {
    let data = { 'main_data': maindata, 'type': type }
    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent, {
      width: '1000px',
      data

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.billDatadetail();
      }


    });
  }

  masterQTY: any = 0;

  printData(data, invoice): void {

    this.service.post_rqst({ 'data': { 'id': data.id, 'bill_number': invoice, 'invoice_id': this.id, 'print': 'yes' } }, 'Dispatch/fetchMasterGrandCouponForPrint').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.printdata = resp['master_grand_coupon'];
        if (this.printdata.length > 0) {
          this.masterQTY = 0;
          for (let i = 0; i < this.printdata.length; i++) {
            this.masterQTY += this.printdata[i]['totalItems']
          }
        }
        this.organisation_name = resp['organisation_name'];
        this.cartennumber = resp['coupon_code'];

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        return;
      }
    }, error => {
    })
    setTimeout(() => {
      if (this.printdata) {

        let printContents, popupWin;
        printContents = document.getElementById('print_card').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();

        popupWin.document.write(`
          <html>
          <head>
          <title>Print tab</title>
          <style>
          @media print {
            #qr_code_container  {
              page-break-inside: always;
              margin-bottom: 0px
            }
            @page { 
              margin: 0.00in 0.00in  0.00in 0.00in;
            }
            
            .aclass {
              width: 70px !important;
              height: 70px !important;
              text-align:right;
            }
            
            .aclass img {
              width: 100%;
              height: 100%;
            }
            
            body
            {
              font-family: 'arial';
            }
            </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
            </html>`
        );

        popupWin.document.close();
      }
    }, 500);
  }




  printItemData() {
    let printContents, popupWin;
    printContents = document.getElementById('item_print_card').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    popupWin.document.write(`
        <html>
        <head>
        <title>Print tab</title>
        <style>
        @media print {
          #qr_code_container  {
            page-break-inside: always;
            margin-bottom: 0px
          }
          @page { 
            margin: 0.00in 0.00in  0.00in 0.00in;
          }
          
          body
          {
            font-family: 'arial';
          }
          </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`
    );

    popupWin.document.close();

  }

  deletemasterboxes(data, number) {
    this.dialogs.confirm("Delete Master Box?").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data': { 'id': data.id, 'bill_number': number } }, 'Dispatch/deleteGrandMasterBox').subscribe((resp) => {
          if (resp['statusCode'] == 200) {
            this.toast.errorToastr('Deleted Successfully..');
            this.billDatadetail();
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




  checkQty(sale_dispatch_qty, sale_qty, remaining_qty, id, i) {
    if (sale_dispatch_qty == 0) {
      if ((parseInt(remaining_qty)) > sale_qty) {
        this.toast.errorToastr('Row number ' + i + ' QTY. can not be greater than' + sale_qty);
        return;
      }
      else {
        this.updateQTY(id, remaining_qty)
      }
    }
    else {
      this.updateQTY(id, remaining_qty);
    }
  }

  updateQTY(id, remaining_qty) {
    this.savingFlag = true;
    this.service.post_rqst({ 'id': id, 'cancel_qty': remaining_qty }, 'Dispatch/deleteDispatchItem').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg']);
        this.dispatchItem = [];
        this.billDatadetail();
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
        return;
      }
    }, error => {
    })
  }
  updateGrandMasterCoupon() {
    this.apiHit.post_rqst({ 'data': { 'dr_id': this.invoice_detail.dr_id, 'dr_code': this.invoice_detail.dr_code, 'warehouse_id': this.invoice_detail.warehouse_id, 'bill_dispatch_type': this.invoice_detail.bill_dispatch_type, 'filter': this.filter, 'id': this.search.couponGrandMasterId, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.invoice_detail.company_name, 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no, } }, "Dispatch/updateMasterGrandCouponNew").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.mainmasterboxDisable = true;
        this.masterboxData = result['master_grand_coupon']
        this.toast.successToastr('Success');
        this.billDatadetail()
        this.getmasterboxnew('');
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.mainmasterboxDisable = false;
      }
    }
    ))
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

