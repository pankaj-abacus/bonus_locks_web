import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-add-spare',
  templateUrl: './add-spare.component.html',
  styleUrls: ['./add-spare.component.scss']
})
export class AddSpareComponent implements OnInit {

  formData:any={}
  dealerList: any = [];

  constructor(public serve: DatabaseService) { }

  ngOnInit() {
    this.getDealerList('');

  }

  getDealerList(search) {
    console.log(search);
    
    this.serve.post_rqst({ 'search': search }, "ServiceTask/dealerList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dealerList = result['dealer'];
        console.log(this.dealerList);

      }
    }))

  
  }
  get_dealer_detail(id){
    if (id) {
      let index = this.dealerList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.dealer_name = this.dealerList[index].name;
        this.formData.dealer_company_name = this.dealerList[index].company_name;
        this.formData.dealer_mobile = this.dealerList[index].mobile;
      }
    }
  }

}
