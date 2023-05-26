import { Component, OnInit , ElementRef, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-gatepass-scanning',
  templateUrl: './gatepass-scanning.component.html',
  styleUrls: ['./gatepass-scanning.component.scss']
})
export class GatepassScanningComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  skLoading:boolean = false;
  gatepassdetaildata:any={};
  userData:any;
  data:any ={};
  id:any;
  assign_login_data:any={};
  logined_user_data:any={};
  couponNumber:any= {};
  mastercartendata:any= [];
  enable:boolean=false
  savingFlag:boolean=false
  constructor(public service:DatabaseService,public toast:ToastrManager,public route:ActivatedRoute,public rout: Router,public session:sessionStorage ) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id=this.userData['data']['id'];
    this.data.created_by_name=this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.route.params.subscribe( params => {
      this.id = params.id;
    });
   }

  ngOnInit() {
    this.gatepassdetail()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      
      this.inputEl.nativeElement.focus();
    }, 100);

  }
  gatepassdetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'id': this.id},"Dispatch/gateScanList")
    .subscribe((result=>{
      if(result['statusCode']==200){
        
        this.gatepassdetaildata=result['detail'];
        this.mastercartendata=result['result']
        this.skLoading = false;
        this.service.count_list();
      }else{
        this.skLoading = false;
        this.service.count_list();
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  numMatches:any=0
  checkCoupon(coupon){
    console.log(coupon);
    // this.numMatches = 0;
    for (let i = 0; i < this.mastercartendata.length; i++) {
      if (this.mastercartendata[i].coupon_code==coupon && this.mastercartendata[i].scanned!=true) {
        console.log('Valid Coupon');
        this.mastercartendata[i].scanned=true
        this.numMatches++;
        this.toast.successToastr(this.mastercartendata[i].coupon_code + ' Scanned Succussfully..')
        this.couponNumber.coupon_number='';
      }
      else{
        console.log('invalid');    
        // this.couponNumber.coupon_number='';

        // this.toast.errorToastr('Not A valid Coupon')

      }
     
      
    }
    console.log(this.numMatches);
    
    if (this.numMatches === this.mastercartendata.length) {
      this.enable = true;
    } else {
      this.enable = false;
    }
  }

  scanningSave(id){
    this.savingFlag=true;
    this.service.post_rqst({'data':{'id': id}},"Dispatch/printGatepass")
    .subscribe((result=>{
      if(result['statusCode']==200){
        
        // this.gatepassdetaildata=result['detail'];
        // this.mastercartendata=result['result']
        this.savingFlag = false;
        this.rout.navigate(['company-dispatch']);
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
        // margin: 0.07in 0.1in 0.00in;  
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
        
      }else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
}
