import { Component,NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
  
})
export class StockListComponent implements OnInit {
  stock_list: any = [];
  active_tab: any;
  loader: boolean = false;
  excelLoader:boolean = false;
  filter:any ={};
  start: number=0;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  pageCount: any;
  sr_no: any = 0;
  // data: any = {};
  product_details: any = [];
  value: {};
  constructor(
    public service: DatabaseService,
    public apiHit: DatabaseService,
    public Router: Router,public ActivatedRoute: ActivatedRoute,
    public dialog: MatDialog, public alert: DialogComponent,
    public toast: ToastrManager,
    ) {
      this.page_limit = service.pageLimit;
      this.stockdata();
    }
    
    ngOnInit() {
    }
    
    previousPage() {
      this.start = this.start - this.page_limit;
      this.stockdata();
    }
    
    nextPage() {
      this.start = this.start + this.page_limit;
      this.stockdata();
    }
    
    stockdata(action: any = '') {
      this.loader = true;
      
      if (action == "refresh") {
        this.filter = {};
        this.stock_list = [];
        this.start = 0;
      }
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if (this.start < 0) {
        this.start = 0;
      }
      
      this.apiHit.post_rqst({'filter': this.filter,'start': this.start, 'pagelimit': this.page_limit},"Stock/stock_details")
      .subscribe((result => {
        if(result['statusCode']==200){
          this.stock_list = result['result'];
          this.loader = false;
          this.pageCount=result['count']
          
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
        else{
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      })
      )}
      
      refresh() 
      {
        this.start= 0;
        this.value={};
        this.filter = {};
        this.service.currentUserID = ''
        this.stockdata();
      }
    }
    // https://devcrm.abacusdesk.com/pearlnew/api/index.php/Work/stockDetails
    // https://devcrm.abacusdesk.com/pearlnew/api/index.php/Stock/stockDetails