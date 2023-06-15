import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionListComponent } from '../inspection-list/inspection-list.component';
import { InspectionAddComponent } from '../inspection-add/inspection-add.component';
import { InspectionDetailComponent } from '../inspection-detail/inspection-detail.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';

const inspectionRoutes = [
  { path: "", children:[
    { path: "", component: InspectionListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-complaint', component: InspectionAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "complaint-detail/:id", children:[
      {path:"", component:InspectionDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    ] }
  ]},
]

@NgModule({
  declarations: [InspectionDetailComponent,InspectionAddComponent,InspectionListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(inspectionRoutes),
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
export class InspectionModuleModule { }
