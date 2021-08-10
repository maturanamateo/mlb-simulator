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
  }

}
