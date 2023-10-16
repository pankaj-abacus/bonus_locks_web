import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';




@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent implements OnInit {
  search: any = {};
  today_date: any = new Date();
  lastPageData: any = {}
  excel_loader:boolean=false;
  filter:any={};
  monthlyWorkReport: any = []
  usersList: any = [];
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, public service: DatabaseService, private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>, public toast: ToastrManager) {
    this.lastPageData = data;
    console.log(data)
    this.getSalesUserForReporting()
    if (this.lastPageData.filterPage == 'checkin_list') {
      this.getSalesUser('');
    }
    if (this.lastPageData.filterPage == 'Expense') {
      this.getSalesUser('');
    }
    if (this.lastPageData.filterPage == 'product_wise_secondary_report') {
      this.getSalesUser('');
    }

  }

  ngOnInit() {
  }
  public date(date) {
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }
  salesUser: any = [];
  getSalesUser(searchValue) {
      let header;
    if (this.lastPageData.filterPage == 'Expense') {
      header='Expense/salesUserListExpense';
    }
    if (this.lastPageData.filterPage == 'product_wise_secondary_report') {
      header='Expense/salesUserList';      
    }
    if (this.lastPageData.filterPage == '"checkin_list"') {
      header='Expense/salesUserList';      
    }
    this.service.post_rqst({ 'search': searchValue }, header).subscribe((response => {
      if (response['statusCode'] == 200) {
        this.salesUser = response['all_sales_user'];
        if (this.lastPageData.filterPage == 'product_wise_secondary_report') {
          this.salesUser.unshift({ 'id': 'All', 'name': 'All', 'role_name': '' })
        }
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }));
  }



  getValue() {
    this.bottomSheetRef.dismiss(this.search);
  }

  getSalesUserForReporting() {
    this.excel_loader = true;
    this.service.post_rqst({}, 'Travel/getSalesUserForReporting').subscribe((r) => {
      if (r['all_sales_user']['statusCode'] == 200) {
        this.excel_loader = false;
        this.usersList = r['all_sales_user']['all_sales_user'];
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(r['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }

  allSalesUser1(action) {
    console.log(action)
              
              
    // if (action == 'allSalesUser') {
        // setTimeout(() => {
            if (this.search.allSalesUser == true) {
                const productData = [];
                for (let i = 0; i < this.usersList.length; i++) {
                    productData.push(this.usersList[i].id)
                }
                console.log(productData)
                this.search.emp_code = productData;
                console.table(this.search.emp_code)
                
            } else {
                this.search.emp_code = [];
                console.table(this.search.emp_code)
            }
        // }, 100);
    // }
  }

}
