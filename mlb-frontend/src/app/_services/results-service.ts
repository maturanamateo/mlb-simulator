import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Result } from '../_models/result.model';

@Injectable()
export class ResultService {

    constructor(private http: HttpClient) {}

    getResults(): Observable<Result[]> {
        return this.http.get<Result[]>(`${environment.apiUrl}/results/results`, {
            params: {}
        });
    }
}
