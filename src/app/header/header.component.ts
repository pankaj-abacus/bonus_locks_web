import { Component, OnInit, Renderer2 } from '@angular/core';
import { sessionStorage } from '../localstorage.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit {
  searchData: any = {};
  login_data: any = {};
  dataList: any = [];
  constructor(private renderer: Renderer2, public session: sessionStorage, public toastCtrl: ToastrManager, public serve: DatabaseService, public router: Router, public dialog: DialogComponent) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }

  ngOnInit() {
  }

  colorMode: boolean = false;
  nightMode() {
    this.colorMode = !this.colorMode;
    if (this.colorMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
    else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  toggle: boolean = false;
  toggleNav() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }

  filter_dr(search) {
    console.log(search);
    if (search.length > 3) {
      this.serve.post_rqst({ 'search': search }, "Master/masterSearch").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.dataList = result['result'];
        }
        else {
          this.toastCtrl.errorToastr(result['statusMsg']);
        }
      }))

    }
  }


  id: any
  type: any
  dr_type: any
  gotodetail(data) {
    this.id = data.id
    this.type = data.module_name;
    console.log(this.type);
    this.dr_type = data.type
    console.log(this.dr_type);
    if (this.type == 'Channel Partner' || this.type == 'Dealer' || this.type == 'Direct Dealers') {
      this.router.navigate(['/distribution-list/' + data.type + '/' + data.module_name + '/distribution-detail/' + this.id, { queryParams: { 'state': data.state, 'id': data.id, 'type': data.type } }])
    }
    else if(this.type == 'Customer' || this.type == 'Plumber') {
      this.router.navigate(['/influencer/' + data.type + '/' + data.module_name + '/influencer-detail/' + this.id + '/' + data.type])
    } 
    else if(this.type == '') {
      this.router.navigate(['/sale-user-list/sale-user-detail/'+data.id])
    } 
    // else {
    //   this.router.navigate(['/sale-user-list/sale-user-detail/'+data.id]);
    // }
    this.searchData = {}
    this.dataList = [];
  }





  logout() {
    this.dialog.confirm("Logout").then((result) => {
      if (result) {
        this.session.LogOutSession();
        this.router.navigate(['']);
        window.location.reload();
      }
    });

  }
}
