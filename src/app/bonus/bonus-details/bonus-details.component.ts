import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { BonusUpdateComponent } from '../bonus-update/bonus-update.component';

@Component({
  selector: 'app-bonus-details',
  templateUrl: './bonus-details.component.html'
})
export class BonusDetailsComponent implements OnInit {
  id: any;
  data: any = {};
  skLoading: boolean = false;
  savingFlag: boolean = false;
  bonusdetail_data: any = {};
  districts: any = [];
  State_list: any = [];
  form_statelist: any = [];
  form_districtlist: any = [];
  assign_login_data: any = {};
  logined_user_data: any = {};
  runningScheme: any = [];
  filter: any = {};
  page_limit: any;
  start: any = 0;
  pagenumber: any = 1;
  total_page: any;
  pageCount: any;
  sr_no: any = 0;
  select_all: any = false;
  removeUser: any = [];
  unRemoveUser: any = [];

  constructor(public route: ActivatedRoute, public toast: ToastrManager, public dialog: MatDialog, public dialogs: DialogComponent, public session: sessionStorage, public rout: Router, public service: DatabaseService, public alrt: MatDialog) {
    this.assign_login_data = this.session.getSession();
    this.page_limit = service.pageLimit;
    this.logined_user_data = this.assign_login_data.value.data;
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.bonus_detail();
    });
  }

  ngOnInit() {
  }



  pervious() {
    this.start = this.start - this.page_limit;
    this.bonus_detail();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.bonus_detail();
  }


  bonus_detail() {
    this.skLoading = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.service.post_rqst({ 'id': this.id, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Bonus/bonusDetail').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.bonusdetail_data = resp['data'];
        // this.bonusdetail_data.locationId = this.bonusdetail_data.locationId.toString()
        console.log(this.bonusdetail_data)
        this.runningScheme = resp['data']['influencer_ids'];
        this.pageCount = resp['count'];
        for (var i = 0; i < this.runningScheme.length; i++) {
          if (this.select_all) {
            this.runningScheme[i]['checked'] = true;
          }
        }
        this.skLoading = false;
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
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }






  btn:any=false;
  select_item(event, indx) {
    if (event.checked) {
      this.btn=true;
      this.removeUser.push(this.runningScheme[indx]['id']);
      let idx = this.unRemoveUser.findIndex(row => row.id == this.runningScheme[indx].id);
      this.unRemoveUser.splice(idx, 1);
    }
    else {
      this.btn=false;
      let idx = this.removeUser.findIndex(row => row.id == this.runningScheme[indx].id);
      this.removeUser.splice(idx, 1);
      this.unRemoveUser.push(this.runningScheme[indx]['id']);
      console.log(this.removeUser);
    }
  }



  select_all_data() {
    this.removeUser = [];
    this.unRemoveUser = [];
    this.runningScheme.forEach(element => {
      element.checked = this.select_all
    });
  }



  edit() {
    this.rout.navigate(['/bonus-edit/' + this.id]);
  }

  influencerUpdate() {

    this.savingFlag = true;
    this.data.update_id = this.id;
    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.influencer_ids = this.removeUser;
    this.data.delete_type = this.select_all;


    this.service.post_rqst({ 'scheme': this.data, 'action': 'delete' }, 'Bonus/updateBonus').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.select_all = false;
        this.bonus_detail();
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }



  update(data, type): void {
    const dialogRef = this.dialog.open(BonusUpdateComponent, {
      width: '1024',
      panelClass: 'cs-modal',
      data: {
        data: data,
        type: type,
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.bonus_detail();
      }
    });
  }

  upload_excel(type, id, district, userType, influencerType) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': 'Bonus',
        'modal_type': type,
        'district': district,
        'user_type': userType,
        'influencer_type': influencerType,
        'bonus_id': id

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.bonus_detail();
      }

    });
  }

}
