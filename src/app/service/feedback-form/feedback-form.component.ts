import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {


  data:any={};
  constructor(public service: DatabaseService,public rout: Router,public route: ActivatedRoute,public toast:ToastrManager,) { }

  ngOnInit() {
  }
  Submit()
  {
    console.log(this.data);
    this.service.post_rqst({"data" :this.data},"ServiceCustomer/test").subscribe((result=>
      {
        if (result['statusCode'] == 200) {

          // this.rout.navigate(['/customer-list']);

          this.toast.successToastr(result['statusMsg']);

        }
        else{
          this.toast.errorToastr(result['statusMsg']);

        }
      }));
    }
  }
