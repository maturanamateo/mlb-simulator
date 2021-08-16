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
import { CategoryService, LineSeriesService} from '@syncfusion/ej2-angular-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameProjectionsComponent,
    HeaderComponent,
    FooterComponent,
    GraphsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartModule
  ],
  providers: [CategoryService, LineSeriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
