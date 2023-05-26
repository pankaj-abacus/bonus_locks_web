import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-coupon-code-detail',
  templateUrl: './coupon-code-detail.component.html'
})
export class CouponCodeDetailComponent implements OnInit {
  
  coupon_id;
  getData:any ={};
  qrCode:any =[];
  elementType:any=''
  skLoading:boolean = false;
  today_date:Date;
  
  
  constructor( public location: Location, public session: sessionStorage,  private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public dialog1: DialogComponent) {
    this.today_date = new Date();
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.coupon_id = params.id;
      if(this.coupon_id){
        this.getCouponDetail();
      }
    });
  }
  
  back(): void {
    this.location.back()
  }
  
  getCouponDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'offer_coupon_history_id':this.coupon_id},"CouponCode/couponSummaryDetail").subscribe((result=>
      {
        
        if (result['statusCode'] == 200){
          this.getData = result.coupon_history;
          this.qrCode = result.coupon_master_list;
          this.skLoading = false;
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }
      ));
    }
    
    
    
    printData(): void
    {
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
        
        .qr_img{
          position: relative;
          text-align: center;
          font-size: 0.5rem
        }
        .qr_img span {
          position: absolute;
          left: 0;
          z-index: 1;
        }
        .qr_img ngx-qrcode, .aclass{
          width: 94.488188976px !important;
          height: 94.488188976px !important;
          text-align: center;
          position: relative;
        }
        
 
        
        span.fix-text {
          position: absolute;
          left: -20px;
          top: 30px;
          transform: rotate(-90deg);
          font-weight: bold;
          font-size: 14px;
          width: 60px;
          height: 20px;
          display: flex;
          justify-content: center;
        }
        
        span.fix-text-code{
          position: absolute;
          top: 33px;
          left: -20px;
          transform: rotate(-90deg);
          font-weight: bold;
          font-size: 8px;
          height: 15px;
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        span.fix-text-right {
          position: absolute;
          left: 58px;
          top: 30px;
          transform: rotate(-90deg);
          font-weight: bold;
          font-size: 10px;
          width: 60px;
          height: 20px;
          display: flex;
          justify-content: center;
        }
        
        span.fix-code {
          position: absolute;
          bottom: 8px;
          font-size: 9px;
          width: 100%;
          font-weight: 600;
        }
        .qr_img img{
          width: 82px !important;
          height: 82px !important;
        }
        
        
        
        .qr-codes {
          position: relative;
        }
        .qr-codes span{
          position: absolute;
          font-size: 10px;
          bottom: -2px;
          text-align: center;
          width: 100%;
          left:50%;
          transform:translateX(-50%);
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
      
      
    }
    