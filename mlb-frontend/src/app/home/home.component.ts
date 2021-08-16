import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Result } from '../_models/result.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  results: Result[];
  ALE: Result[] = [];
  ALC: Result[] = [];
  ALW: Result[] = [];
  NLE: Result[] = [];
  NLC: Result[] = [];
  NLW: Result[] = [];
  divisions: Result[][] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Result[]>(`${environment.apiUrl}/results/results`).subscribe(data =>
      {
        this.results = data;
        this.getDivisions();
      }
    );
  }

  getDivisions(): void {
    for (let i = 0; i < 5; i++) {
      this.ALE.push(this.results[i]);
    }
    for (let i = 5; i < 10; i++) {
      this.ALC.push(this.results[i]);
    }
    for (let i = 10; i < 15; i++) {
      this.ALW.push(this.results[i]);
    }
    for (let i = 15; i < 20; i++) {
      this.NLE.push(this.results[i]);
    }
    for (let i = 20; i < 25; i++) {
      this.NLC.push(this.results[i]);
    }
    for (let i = 25; i < 30; i++) {
      this.NLW.push(this.results[i]);
    }
    this.divisions.push(this.ALE);
    this.divisions.push(this.ALC);
    this.divisions.push(this.ALW);
    this.divisions.push(this.NLE);
    this.divisions.push(this.NLC);
    this.divisions.push(this.NLW);
  }

  getPlayoffColor(odds: number) {
    let red = 0;
    let green = 0;
    if (odds >= 50) {
      red = Math.max(Math.floor(255 - (4 * (odds - 50))), 0);
      green = 255;
    } else {
      red = 255;
      green = Math.max(Math.floor(255 - (4 * (50 - odds))), 0);
    }
    return 'rgba(' + red + ',' + green + ', 0, .8)';
  }

  getPennantColor(odds: number) {
    let red = 0;
    let green = 0;
    if (odds >= 20) {
      red = Math.max(Math.floor(255 - (10 * (odds - 20))), 0);
      green = 255;
    } else {
      red = 255;
      green = Math.max(Math.floor(255 - (10 * (20 - odds))), 0);
    }
    return 'rgba(' + red + ',' + green + ', 0, .8)';
  }

  getWSColor(odds: number) {
    let red = 0;
    let green = 0;
    if (odds >= 8) {
      red = Math.max(Math.floor(255 - (25 * (odds - 8))), 0);
      green = 255;
    } else {
      red = 255;
      green = Math.max(Math.floor(255 - (25 * (8 - odds))), 0);
    }
    return 'rgba(' + red + ',' + green + ', 0, .8)';
  }

}
