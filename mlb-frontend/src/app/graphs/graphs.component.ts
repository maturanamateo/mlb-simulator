import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HistoricalOdds } from '../_models/result.model';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  historicalOdds: HistoricalOdds[] = [];
  odds: number[][] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<HistoricalOdds[]>(`${environment.apiUrl}/results/date`).subscribe(data =>
      {
        this.historicalOdds = data;
        this.setOdds();
      }
    );
  }

  setOdds(): void {
    for (let i = 0; i < this.historicalOdds.length; i++) {
      const teamOdds = this.historicalOdds[i].teamResults;
      for (let j = 0; j < teamOdds.length; j++) {
        if (i === 0) {
          const arr = [teamOdds[j].odds];
          this.odds.push(arr);
        } else {
          this.odds[j].push(teamOdds[j].odds);
        }
      }
    }
    console.log(this.odds);
  }

}
