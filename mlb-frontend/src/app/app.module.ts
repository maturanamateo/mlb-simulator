import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameProjectionsComponent } from './game-projections/game-projections.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GraphsComponent } from './graphs/graphs.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, DateTimeService, LineSeriesService, DataLabelService} from '@syncfusion/ej2-angular-charts';
import { LegendService } from '@syncfusion/ej2-angular-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateResultComponent } from './date-result/date-result.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameProjectionsComponent,
    HeaderComponent,
    FooterComponent,
    GraphsComponent,
    DateResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NoopAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  providers: [CategoryService, LineSeriesService, DateTimeService, DataLabelService,
              LegendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
