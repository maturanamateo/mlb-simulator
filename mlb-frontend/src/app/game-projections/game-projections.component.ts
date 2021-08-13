import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DateProjections } from '../_models/result.model';

@Component({
  selector: 'app-game-projections',
  templateUrl: './game-projections.component.html',
  styleUrls: ['./game-projections.component.css']
})
export class GameProjectionsComponent implements OnInit {

  games: DateProjections;
  currentDate: string = new Date().toLocaleDateString();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<DateProjections>(`${environment.apiUrl}/results/projections`).subscribe(data =>
      {
        this.games = data;
        console.log(this.games);
      }
    );
  }

}
