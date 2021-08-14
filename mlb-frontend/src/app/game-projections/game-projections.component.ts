import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DateProjections, TeamGame } from '../_models/result.model';

@Component({
  selector: 'app-game-projections',
  templateUrl: './game-projections.component.html',
  styleUrls: ['./game-projections.component.css']
})
export class GameProjectionsComponent implements OnInit {

  games: TeamGame[][];
  currentDate: Date;
  dateString: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<DateProjections>(`${environment.apiUrl}/results/projections`).subscribe(data =>
      {
        this.games = data.games;
        this.currentDate = new Date(data.date);
        this.setDateString(this.currentDate);
      }
    );
  }

  setDateString(date: Date) {
    this.dateString = date.toDateString();
    console.log(this.dateString);
  }

}
