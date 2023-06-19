import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-engineer-assign-model',
  templateUrl: './engineer-assign-model.component.html',
  styleUrls: ['./engineer-assign-model.component.scss']
})
export class EngineerAssignModelComponent implements OnInit {
  data:any={}
  engineerList: any = [];


  constructor(public service: DatabaseService,public toast: ToastrManager) { }

  ngOnInit() {
    this.assign_engineerget();
  }


  assign_engineerget() {

    this.service.post_rqst({}, "Influencer/getAllDistrict").subscribe((result => {
      
      if (result['statusCode'] == 200) {
        this.engineerList = this.data;
        console.log(this.engineerList);
        
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
    
  }

}
