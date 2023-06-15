import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';



@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  data: any = {};
  states:any =[];
  dr_type: any;
  district_list: any = [];
  savingFlag:boolean = false;
  params_id: any;
  getData:any ={};  
  id: any;
  
  params_network:any;
  params_type:any;
  
  constructor(
    public service: DatabaseService,
    public rout: Router,
    public location: Location,
    public route: ActivatedRoute,
    public toast:ToastrManager,
    public session: sessionStorage,
    private http: HttpClient
    ) {
      this.data.country = 'india';
      this.getStateList();
      this.route.params.subscribe(params => {
        this.id =  params.id;
        console.log(this.id);
        if (this.id) {
          this.getCustomerDetail(this.id);
        }
        
        
      });
    }
    
    ngOnInit() {
    }
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
      
    }
    getDistrict(val) {
      let st_name;
      if(val == 1)
      {
        st_name = this.data.state;
      }
      this.service.post_rqst({'state_name':st_name}, "Influencer/getAllDistrict").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.district_list = result['all_district'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
      
    }
    getStateList() {
      this.service.post_rqst(0, "Influencer/getAllState").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    submitDetail()
    {
      
      this.savingFlag = true;
      let header
      if(this.id){
        header =this.service.post_rqst({"data":this.data,'type': 'Edit','id':this.id},"ServiceCustomer/serviceCustomerAdd") 
      }
      else
      {
        header =this.service.post_rqst({"data":this.data,'type': 'Add',},"ServiceCustomer/serviceCustomerAdd") 
      }
      header.subscribe((result=>
        {
          if (result['statusCode'] == 200) {

          this.rout.navigate(['/customer-list']);

            this.toast.successToastr(result['statusMsg']);
            this.savingFlag = false;
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
            this.savingFlag = false;
          }
          
        }));
      }
      back(): void {
        this.location.back()
      }
      
      getCustomerDetail(id)
      {
        this.service.post_rqst({'customer_id':id},"ServiceCustomer/serviceCustomerDetail").subscribe((result=>
          {
            this.getData = result['result'];
            console.log('getData',this.getData);
            this.data = this.getData;
            this.getDistrict(1)
          }
          ));
          
        }
        
        
      }
      