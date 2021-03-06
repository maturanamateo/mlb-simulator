import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameProjectionsComponent } from './game-projections/game-projections.component';
import { GraphsComponent } from './graphs/graphs.component';
import { DateResultComponent } from './date-result/date-result.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'today', component: GameProjectionsComponent},
  { path: 'graphs', component: GraphsComponent},
  { path: 'historical', component: DateResultComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
