import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { ServicePaymentAddComponent } from '../service-payment-add/service-payment-add.component';
@Component({
  selector: 'app-service-invoice-detail',
  templateUrl: './service-invoice-detail.component.html',
  styleUrls: ['./service-invoice-detail.component.scss']
})
export class ServiceInvoiceDetailComponent implements OnInit {
  
  id;
  getData: any = {};
  skLoading: boolean = false;
  url: any;
  add_list:any =[];
  
  
  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    
    
    this.url = this.service.uploadUrl + 'service_task/'
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getInvoiceDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  getInvoiceDetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'invoice_id': this.id }, "ServiceInvoice/serviceInvoiceDetail").subscribe((result => {
      
      this.getData = result['result'];
      this.add_list = this.getData['add_list'];
      
      console.log(result);
      console.log(this.getData);
      console.log(this.add_list);
      
      
      this.skLoading = false;
    }
    ));
    
  }
  back(): void {
    this.location.back()
  }
  
  loader: any;
  exportPdf() {
    this.loader = 1;
    this.skLoading = true;
    this.service.post_rqst({'invoice_id':this.id}, "ServiceInvoice/exportInvoice").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        window.open(this.service.uploadUrl + 'orderPdf/' + result['file_name']);
        setTimeout(() => {
          this.loader = '';
          
        }, 700);
      } else {
        setTimeout(() => {
          this.loader = '';
          
        }, 700);
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }
    , err => {
      this.skLoading = false;
      
    }
    )
  }
  addPayment(invoice_id,invoice_final_amount) {
    const dialogRef = this.dialog.open(ServicePaymentAddComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        invoice_id:invoice_id,
        invoice_final_amount:invoice_final_amount
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {        
        this.getInvoiceDetail();
      }
    });
  }
  
}
