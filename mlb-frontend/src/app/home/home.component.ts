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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Result[]>(`${environment.apiUrl}/results/results`).subscribe(data =>
      {
        this.results = data;
      }
    );
  }

}
