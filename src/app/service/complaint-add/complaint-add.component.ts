import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-complaint-add',
  templateUrl: './complaint-add.component.html',
  styleUrls: ['./complaint-add.component.scss']
})
export class ComplaintAddComponent implements OnInit {

  data: any = {};
  states:any =[];
  dr_type: any;
  district_list: any = [];
  savingFlag:boolean = false;
  params_id: any;
  
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
      this.route.queryParams.subscribe(params => {
        this.dr_type = params.type;
        if(params.type){
          
          this.params_network =  params.network;
          this.params_type =  params.type;
          this.params_id =  params.id;
        }
        
      });
  }
  
  ngOnInit() {
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
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    
  }
  submitDetail()
  {
    
    this.savingFlag = true;
    let header
    if(this.params_id){
      header =this.service.post_rqst({"data":this.data,'type': 'Edit','influencer_type':this.params_network},"Influencer/updateInfluencer") 
    }
    else
    {
      header =this.service.post_rqst({"data":this.data,'type': 'Add','influencer_type':this.params_network},"ServiceCustomer/serviceCustomerAdd") 
    }
    header.subscribe((result=>
      {
        if (result['statusCode'] == 200) {
          this.rout.navigate(['/influencer/'+this.params_type+'/'+this.params_network+'/']);
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
    
  }
  