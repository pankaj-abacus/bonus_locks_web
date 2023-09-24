import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss']
})
export class ManageStockComponent implements OnInit {

  spareList: any = [];
  add_list: any = [];
  formData: any = {}
  spare_data: any = {};
  id;
  savingFlag: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<ManageStockComponent>, public service: DatabaseService, public toast: ToastrManager, public alert: DialogComponent, public dialog: MatDialog) { }

  ngOnInit() {
    this.getSparePartList('');
  }

  getSparePartList(search) {
    this.service.post_rqst({ 'search': search }, "ServiceSparePart/getSparePartName").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.spareList = result['result'];
      }
    }))
  }
  get_spare_detail(id) {
    if (id) {
      let index = this.spareList.findIndex(d => d.id == id);
      if (index != -1) {
        this.spare_data.part_no = this.spareList[index].part_no;
        this.spare_data.part_name = this.spareList[index].part_name;
      }
    }
  }

  addSpare() {

    if (this.spare_data.qty == 0 || this.spare_data.qty == undefined || this.spare_data.qty == null || !this.spare_data.qty) {
      this.toast.errorToastr("QTY Should Be More Then Zero");
      return;
    }
    if (this.spare_data.id) {
      let index = this.spareList.findIndex(d => d.id == this.spare_data.id);
      if (index != -1) {
        this.spare_data.part_name = this.spareList[index].part_name;
        this.spare_data.part_no = this.spareList[index].part_no;
      }
    }
    if (this.spare_data.id) {
      let index = this.spareList.findIndex(d => d.id == this.spare_data.id);
      if (index != -1) {
        this.spare_data.category_name = this.spareList[index].category;
      }
    }
    if (this.add_list.length == 0) {
      this.add_list.push(JSON.parse(JSON.stringify(this.spare_data)))
      this.spare_data = {}
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list.findIndex(row => row.id == this.spare_data.id);
      if (isExistIndex == -1) {
        this.add_list.push(JSON.parse(JSON.stringify(this.spare_data)))
        this.spare_data = {}

      }
      else {
        this.add_list[isExistIndex].qty = parseInt(this.formData.qty)
        this.spare_data = {}

      }
    }
  }

  delete(i) {
    this.add_list.splice(i, 1)
  }


  submit() {
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.add_list }, "ServiceSparePart/submitManageStock").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.dialog.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))

  }

}
