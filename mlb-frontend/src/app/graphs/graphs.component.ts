import { Component, ElementRef, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HistoricalOdds } from '../_models/result.model';
import { AppModule } from '../../app/app.module';
import * as d3 from 'd3';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  historicalOdds: HistoricalOdds[] = [];
  odds: { date: Date, value: number, }[][] = [];
  yankeeOdds = [];
  primaryXAxis = {valueType: 'Category'};
  chartData = [];

  constructor(private http: HttpClient, public chartElem: ElementRef) { }

  ngOnInit(): void {
    this.http.get<HistoricalOdds[]>(`${environment.apiUrl}/results/date`).subscribe(data =>
      {
        this.historicalOdds = data;
        this.setOdds();
        this.yankeeOdds = this.odds[0];
      }
    );
  }

  setOdds(): void {
    for (let i = 0; i < this.historicalOdds.length; i++) {
      const teamOdds = this.historicalOdds[i].teamResults;
      const curDate = this.historicalOdds[i].date;
      for (let j = 0; j < teamOdds.length; j++) {
        const json = {
          date: curDate,
          value: teamOdds[j].odds
        };
        if (i === 0) {
          const arr = [json];
          this.odds.push(arr);
        } else {
          this.odds[j].push(json);
        }
      }
    }
    console.log(this.odds);
  }

}
