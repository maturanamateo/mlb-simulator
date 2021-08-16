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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<HistoricalOdds[]>(`${environment.apiUrl}/results/date`).subscribe(data =>
      {
        this.historicalOdds = data;
      }
    );
  }

}
