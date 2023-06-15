import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { CustomerAddComponent } from '../customer-add/customer-add.component';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { RouterModule } from '@angular/router';


const customerRoutes = [
  { path: "", children:[
    { path: "", component: CustomerListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-customer', component: CustomerAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "customer-detail/:id", children:[
      {path:"", component:CustomerDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    ] }
  ]},
  
]

@NgModule({
  declarations: [CustomerListComponent,CustomerAddComponent,CustomerDetailComponent],
  imports: [
    RouterModule.forChild(customerRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class CustomerModuleModule { }
