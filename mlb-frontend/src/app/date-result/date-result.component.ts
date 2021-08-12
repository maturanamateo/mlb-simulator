import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-result',
  templateUrl: './date-result.component.html',
  styleUrls: ['./date-result.component.css']
})
export class DateResultComponent implements OnInit {

  /* 1. Create a constant Map teamName --> teamId
   * 2. Create a form with fields of teamId and day
   * 3. Using data from the form, send GET request to backend
   *     - format the teamName into all lowercase so "Yankees" = "yankees"
   *     - Dates in request must be formatted like MM-DD-YYYY
   *     - Error handle for invalid teams/date format
   * 4. Process the data from the request and output into a table
   *     - if empty array, say no games
   */

   /* Example Req link - http://localhost:8080/results/game?id=147&date=08-12-2021 */

  constructor() { }

  ngOnInit(): void {
  }

}
