import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallationListComponent } from '../installation-list/installation-list.component';
import { InstallationAddComponent } from '../installation-add/installation-add.component';
import { InstallationDetailComponent } from '../installation-detail/installation-detail.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { EngineerAssignModelComponent } from '../engineer-assign-model/engineer-assign-model.component';
import { AddInstallationRemarkComponent } from '../add-installation-remark/add-installation-remark.component';

const inspectionRoutes = [
  { path: "", children:[
    { path: "", component: InstallationListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-installation', component: InstallationAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "installation-detail/:id", children:[
      {path:"", component:InstallationDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      {path:'add-installation/:id', component: InstallationAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}

    ] }
  ]},
]

@NgModule({
  declarations: [InstallationListComponent,InstallationAddComponent,InstallationDetailComponent,EngineerAssignModelComponent,AddInstallationRemarkComponent],
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
export class InstallationModuleModule { }
