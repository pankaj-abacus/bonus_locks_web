// import { InjectFlags } from '@angular/compiler/src/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import * as _ from 'lodash';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.scss']
})
export class ProductUploadComponent implements OnInit {
  formData = new FormData();
  excel_name: any ='';
  file : any={};
  file_name:any;
  loader:any;
  url:any;
  downloadUrl:any;
  typecheck:any='';
  istrue:boolean=false;
  assign_login_data:any={};
  logined_user_data:any={};
  savingFlag:boolean = false;
  come_from:any;
  modal_type:any;

  constructor(@Inject(MAT_DIALOG_DATA)public data, public session: sessionStorage, public toast: ToastrManager,public service: DatabaseService,public dialog: DialogComponent,public dialogRef: MatDialogRef<ProductUploadComponent>) {
    this.url = this.service.uploadUrl;
    this.downloadUrl = this.service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.come_from = data['from']
    this.modal_type = data['modal_type']
  }
  ngOnInit() {
  }


  onUploadChange(evt,f)
  {
    this.file = evt.target.files[0];
    f.resetForm();
    this.excel_name = this.file.name;

    const allowed_types = ['text/csv'];
    this.typecheck = !_.includes("text/csv", this.file.type)
    if (!_.includes(allowed_types,this.file.type)) {
      this.toast.errorToastr('Only CSV File Accepted');
      this.file = ''
      this.excel_name ='';
      this.istrue = false;
      return
    }
    let byte = 1000000    // equal to 1mb
    if( this.file.size > (byte*10)){
      this.toast.errorToastr('Csv file size is too large, maximum file size is 10 MB.');
      this.file = ''
      this.istrue = false;
      return
    }
    else{  this.istrue = true;}
  }

  download_sample_file(upload_type){
    this.service.post_rqst({'type': upload_type}, "Master/generateExcelForUpdate").subscribe((result) => {
      if(result['statusCode']==200){
        document.location.replace(this.url +'update_sample_file/updateProduct.csv');
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    })

  }



  upload_user_data_excel(upload_type)
  {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.logined_user_data.id);
    this.formData.append('created_by_name', this.logined_user_data.name);
    this.formData.append('operation_type', this.modal_type);
    this.loader=1;
    this.savingFlag = true;
    let header:any;

    if(upload_type=='insert'){
      header = this.service.FileData((this.formData), 'Master/uploadProductInBulkByCsv')
    }else if(upload_type=='update'){
      header = this.service.FileData((this.formData), 'Master/updateProductBasicInBulkByCsv')
    }else if(upload_type=='update_mrp'){
      header = this.service.FileData((this.formData), 'Master/updateProductMrpInBulkByCsv')
    }else if(upload_type=='update_point'){
      header = this.service.FileData((this.formData), 'Master/updateProductPointCatInBulkByCsv')
    }
    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;

        setTimeout (() => {
          this.loader='';
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }

    },err => {this.formData = new FormData(); });
  }

  upload_user_data_excel2(upload_type)
  {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.logined_user_data.id);
    this.formData.append('created_by_name', this.logined_user_data.name);
    this.formData.append('operation_type', this.modal_type);
    this.loader=1;
    this.savingFlag = true;
    let header:any;

     if (upload_type=='warrantyUpdate'){
      header = this.service.FileData((this.formData), 'ServiceTask/import_product_warranty')
    }

    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;

        setTimeout (() => {
          this.loader='';
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }

    },err => {this.formData = new FormData();});
}



  upload_user_data_excel3(upload_type)
  {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.logined_user_data.id);
    this.formData.append('created_by_name', this.logined_user_data.name);
    this.formData.append('operation_type', this.modal_type);
    this.loader=1;
    this.savingFlag = true;
    let header:any;

     if (upload_type=='addSpare'){
      header = this.service.FileData((this.formData), 'ServiceTask/import_spare_parts')
    }

    header.subscribe(result => {
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;

        setTimeout (() => {
          this.loader='';
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }

    },err => {this.formData = new FormData();});
}





downloadExcel() {
  this.service.post_rqst({}, "Excel/sample_product_warranty").subscribe((result => {
    if (result['msg'] == true) {
      window.open(this.downloadUrl + result['filename'])
    } else {
    }
  }));
}

downloadExcelForSpare() {
  // this.service.post_rqst({}, "Excel/sample_product_warranty").subscribe((result => {
  //   if (result['msg'] == true) {
      window.open(this.downloadUrl + 'sampleSparePart.csv')
  //   } else {
  //   }
  // }));
}


}
