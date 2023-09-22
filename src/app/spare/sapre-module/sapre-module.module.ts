import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { SpareListComponent } from '../spare-list/spare-list.component';
import { AddSpareComponent } from '../add-spare/add-spare.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { SpareAssignQtyComponent } from '../spare-assign-qty/spare-assign-qty.component';
import { SpareIncomingComponent } from '../spare-incoming/spare-incoming.component';
import { SpareOutgoingComponent } from '../spare-outgoing/spare-outgoing.component';
import { AssignQtyComponent } from '../assign-qty/assign-qty.component';
import { ManageStockComponent } from '../manage-stock/manage-stock.component';
import { ReturnStockComponent } from '../return-stock/return-stock.component';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';

const spareRoutes = [
  { path: "", children:[
    { path: "", component: SpareListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},

]

@NgModule({
  declarations: [SpareListComponent,AddSpareComponent,SpareAssignQtyComponent,SpareIncomingComponent,SpareOutgoingComponent,AssignQtyComponent,ManageStockComponent,ReturnStockComponent,ProductUploadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(spareRoutes),
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
export class SapreModuleModule { }
