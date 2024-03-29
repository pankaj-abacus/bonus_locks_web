import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';;
import { AddSpareComponent } from '../add-spare/add-spare.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { AssignQtyComponent } from '../assign-qty/assign-qty.component';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';
@Component({
  selector: 'app-spare-list',
  templateUrl: './spare-list.component.html',
  styleUrls: ['./spare-list.component.scss']
})

export class SpareListComponent implements OnInit {
  fabBtnValue: any = 'add';
  spareList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  tab_active = 'all';
  scheme_active_count: any;
  filter_data: any = {};
  today_date: Date;
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = ''
  url: any;




  constructor(public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.url = this.service.uploadUrl + 'service_task/'
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }
  ngOnInit() {
    this.filter_data = this.service.getData()
    this.getSpareList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getSpareList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getSpareList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getSpareList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getSpareList('');
  }

  imageModel(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getSpareList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    let header = this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "ServiceSparePart/sparePartList")

    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {

        this.spareList = result['result'];
        this.pageCount = result['count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.spareList.length == 0) {
          this.datanotofound = false;
        } else {
          this.datanotofound = true;
          this.loader = false;
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
        this.sr_no = this.sr_no * this.page_limit

        for (let i = 0; i < this.spareList.length; i++) {
          if (this.spareList[i].status == '1') {
            this.spareList[i].newStatus = true
          }
          else if (this.spareList[i].status == '0') {
            this.spareList[i].newStatus = false;
          }
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.datanotofound = true;
        this.loader = false;
      }

    })
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  downloadExcel() {
    this.excelLoader = true;
    this.service.post_rqst({ 'filter': this.filter_data }, "Excel/service_spare_part_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getSpareList('');
        this.excelLoader = false;
      } else {
      }
    }));
  }

  addSpareDialog(type, detail, id) {
    const dialogRef = this.dialog.open(AddSpareComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        type: type,
        detail: detail,
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result != false) {
      this.getSpareList('');
      // }
    });
  }

  spareQty(part_name, part_no, row, type) {
    const dialogRef = this.dialog.open(AssignQtyComponent, {
      width: '550px',
      panelClass: 'cs-modal',
      data: {
        data: row,
        part_name: part_name,
        part_no: part_no,
        type: type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result==true) {        
        this.getSpareList('');
      }
    });
  }

  delete(id) {
    this.dialog1.delete('Spare!').then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': id }, "ServiceSparePart/deleteSparePart").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.getSpareList('')
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });
  }


  upload_excel(type) {
    const dialogRef = this.dialog.open(ProductUploadComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': 'beat',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getSpareList('');
      }
    });
  }
  assignZero(assign_stock) {
    if (assign_stock==0) {
      this.toast.errorToastr('Assign Stock Qty Is Zero');
    }
  }
  outgoingStock(assign_stock) {
    if (assign_stock==0) {
      this.toast.errorToastr('Outgoing Stock Qty Is Zero');
    }
  }
  return(return_data) {
    if (return_data.length==0) {
      this.toast.errorToastr('Return Stock Qty Is Zero');
    }
  }
  returnQty(return_data) {
    if (return_data.length==0) {
      this.toast.errorToastr('Incoming Stock Qty Is Zero');
    }
  }
}

