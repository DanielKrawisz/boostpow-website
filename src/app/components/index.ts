import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';

import { AgGridModule } from 'ag-grid-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';

// Pipes
import { FilterTextPipe } from '@app/pipes/filtertext.pipe';
import { ToUsdWithSignPipe } from '@app/pipes/to-usd-with-sign.pipe';
import { ToUsdOrDefaultPipe } from '@app/pipes/to-usd-or-default.pipe';

// Utility components
import { DropdownFilterComponent } from '@components/utility_components/dropdown_filterlist/dropdown-filterlist.component';
import { FilterlistComponent } from '@components/utility_components/filterlist/filterlist.component';
import { TimeRangeComponent } from '@components/utility_components/time_range/time-range.component';
import { TimeDropdownComponent } from '@components/utility_components/time_dropdown/time-dropdown.component';
import { DropdownComponent } from '@components/utility_components/dropdown/dropdown.component';
import { LoadingStateComponent } from '@components/utility_components/loading/loading.component';

// Components
import { AlertMessagesComponent } from '@components/utility_components/alerts/alerts.component';


// Modals

// Directives
import { DatepickerDirective } from '@app/directives/datepicker/datepicker.directive';
import { OnlyNumberFiledDirective } from '@app/directives/only_number_field/only-number-field.directive';
import { DropdownDatepickerDirective } from '../directives/dropdown_datepicker/dropdown_datepicker.directive';
import { StatusViewComponent } from './status_view/status-view.component';
import { UploadViewComponent } from './upload_view/upload-view.component';
import { FooterComponent } from './footer/footer.component';
import { PreviewViewComponent } from './preview_view/preview-view.component';
import { HeaderComponent } from './header/header.component';
import { HomeViewComponent } from './home_view/home-view.component';
import { CreateViewComponent } from './create_view/create-view.component';
import { JobViewComponent } from './job_view/job-view.component';

export const COMPONENTS = [
  DatepickerDirective,
  DropdownDatepickerDirective,
  OnlyNumberFiledDirective,
  FilterTextPipe,
  ToUsdWithSignPipe,
  ToUsdOrDefaultPipe,
  DropdownFilterComponent,
  FilterlistComponent,
  TimeRangeComponent,
  DropdownComponent,
  LoadingStateComponent,
  TimeDropdownComponent,
  AlertMessagesComponent,
  StatusViewComponent,
  UploadViewComponent,
  FooterComponent,
  PreviewViewComponent,
  HeaderComponent,
  HomeViewComponent,
  CreateViewComponent,
  JobViewComponent
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ClipboardModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    NgxPaginationModule,
    NgxMaskModule.forRoot({})
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [CurrencyPipe]
})
export class ComponentCollectionModule {}