import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TeamGame } from '../_models/result.model';

@Component({
  selector: 'app-date-result',
  templateUrl: './date-result.component.html',
  styleUrls: ['./date-result.component.css']
})
export class DateResultComponent implements OnInit {

  teamToId = new Map();
  areGames = false;
  teams = ['Angels', 'Astros', 'Athletics', 'Blue Jays', 'Blue Jays',
            'Brewers', 'Cardinals', 'Cubs', 'Diamondbacks', 'Dodgers',
            'Giants', 'Indians', 'Mariners', 'Marlins', 'Mets',
            'Nationals', 'Orioles', 'Padres', 'Phillies', 'Pirates',
            'Rangers', 'Rays', 'Red Sox', 'Reds', 'Rockies',
            'Royals', 'Tigers', 'Twins', 'White Sox', 'Yankees'];
  form: FormGroup;
  games: TeamGame[][];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setMap();
    this.form = this.formBuilder.group({
      team: [null, Validators.required],
      date: [null, [Validators.required, this.dateValidator]]
    });
  }

  setMap(): void {
    this.teamToId.set('Angels', 108);
    this.teamToId.set('Astros', 117);
    this.teamToId.set('Athletics', 133);
    this.teamToId.set('Blue Jays', 141);
    this.teamToId.set('Blue Jays', 144);
    this.teamToId.set('Brewers', 158);
    this.teamToId.set('Cardinals', 138);
    this.teamToId.set('Cubs', 112);
    this.teamToId.set('Diamondbacks', 109);
    this.teamToId.set('Dodgers', 119);
    this.teamToId.set('Giants', 137);
    this.teamToId.set('Indians', 114);
    this.teamToId.set('Mariners', 136);
    this.teamToId.set('Marlins', 146);
    this.teamToId.set('Mets', 121);
    this.teamToId.set('Nationals', 120);
    this.teamToId.set('Orioles', 110);
    this.teamToId.set('Padres', 135);
    this.teamToId.set('Phillies', 143);
    this.teamToId.set('Pirates', 134);
    this.teamToId.set('Rangers', 140);
    this.teamToId.set('Rays', 139);
    this.teamToId.set('Red Sox', 111);
    this.teamToId.set('Reds', 113);
    this.teamToId.set('Rockies', 115);
    this.teamToId.set('Royals', 118);
    this.teamToId.set('Tigers', 116);
    this.teamToId.set('Twins', 142);
    this.teamToId.set('White Sox', 145);
    this.teamToId.set('Yankees', 147);
  }

  dateValidator(control: FormControl) {
    const date = control.value;
    const today = new Date();
    console.log(date);
    if (date && date.length === 10) {
      if (date.charAt(2) !== '-' || date.charAt(5) !== '-') {
        return {error: 'invalid format'};
      }
      const month = parseFloat(date.substring(0, 2));
      const day = parseFloat(date.substring(3, 5));
      const year = parseFloat(date.substring(6, 10));
      if (month < 1 || month > 12) {
        return {error: 'invalid month'};
      }
      if (day < 1 || day > 31) {
        return {error: 'invalid day'};
      }
      if (year < 2010) {
        return {error: 'invalid year'};
      }
      if (year > today.getFullYear() || month > today.getMonth() + 1 || day > today.getDate()) {
        return {error: 'future date'};
      }
      return null;
    }
    return {error: 'invalid format'};
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }
    const team = this.teamToId.get(this.form.value.team);
    const date = this.form.value.date;
    this.http.get<TeamGame[][]>(`${environment.apiUrl}/results/game?id=${team}&date=${date}`).subscribe(data =>
      {
        this.games = data;
        this.areGames = (this.games.length === 0) ? false : true;
        console.log(this.areGames);
        console.log(this.games);
      }
    );
  }

}
