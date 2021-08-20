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
  teams = ['Angels', 'Astros', 'Athletics', 'Blue Jays', 'Braves',
            'Brewers', 'Cardinals', 'Cubs', 'Diamondbacks', 'Dodgers',
            'Giants', 'Indians', 'Mariners', 'Marlins', 'Mets',
            'Nationals', 'Orioles', 'Padres', 'Phillies', 'Pirates',
            'Rangers', 'Rays', 'Red Sox', 'Reds', 'Rockies',
            'Royals', 'Tigers', 'Twins', 'White Sox', 'Yankees'];
  form: FormGroup;
  games: TeamGame[][];
  teamColors = new Map();

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setMap();
    this.setTeamColors();
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
    this.teamToId.set('Braves', 144);
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

  setTeamColors(): void {
    this.teamColors.set('Arizona Diamondbacks', 'rgba(167, 25, 48, .8)');
    this.teamColors.set('Atlanta Braves', 'rgba(206, 17, 65, .8)');
    this.teamColors.set('Baltimore Orioles', 'rgba(223, 70, 1, .8)');
    this.teamColors.set('Boston Red Sox', 'rgba(189, 48, 57, .8)');
    this.teamColors.set('Chicago Cubs', 'rgba(14, 51, 134, .8)');
    this.teamColors.set('Chicago White Sox', 'rgba(196, 206, 212, .8)');
    this.teamColors.set('Cincinnati Reds', 'rgba(198, 1, 31, .8)');
    this.teamColors.set('Cleveland Indians', 'rgba(12, 35, 64, .7)');
    this.teamColors.set('Colorado Rockies', 'rgba(51, 0, 111, .7)');
    this.teamColors.set('Detroit Tigers', 'rgba(12, 35, 60, .7)');
    this.teamColors.set('Houston Astros', 'rgba(235, 110, 31, .8)');
    this.teamColors.set('Kansas City Royals', 'rgba(0, 70, 135, .8)');
    this.teamColors.set('Los Angeles Angels', 'rgba(186, 0, 33, .8)');
    this.teamColors.set('Los Angeles Dodgers', 'rgba(0, 90, 156, .8)');
    this.teamColors.set('Miami Marlins', 'rgba(65, 116, 141, .8)');
    this.teamColors.set('Milwaukee Brewers', 'rgba(255, 197, 47, .8)');
    this.teamColors.set('Minnesota Twins', 'rgba(0, 43, 92, .8)');
    this.teamColors.set('New York Mets', 'rgba(0, 45, 114, .8)');
    this.teamColors.set('New York Yankees', 'rgba(0, 48, 135, .8)');
    this.teamColors.set('Oakland Athletics', 'rgba(0, 56, 49, .7)');
    this.teamColors.set('Philadelphia Phillies', 'rgba(232, 24, 40, .8)');
    this.teamColors.set('Pittsburgh Pirates', 'rgba(253, 184, 39, .8');
    this.teamColors.set('St. Louis Cardinals', 'rgba(196, 30, 58, .8)');
    this.teamColors.set('San Diego Padres', 'rgba(255, 196, 37, .8)');
    this.teamColors.set('San Francisco Giants', 'rgba(253, 90, 30, .8)');
    this.teamColors.set('Seattle Mariners', 'rgba(0, 92, 92, .8)');
    this.teamColors.set('Tampa Bay Rays', 'rgba(143, 188, 230, .8)');
    this.teamColors.set('Texas Rangers', 'rgba(0, 50, 120, .8)');
    this.teamColors.set('Toronto Blue Jays', 'rgba(19, 74, 142, .8)');
    this.teamColors.set('Washington Nationals', 'rgba(171, 0, 3, .8)');
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
      const dateNative = new Date(year, month - 1, day);
      if (today.getTime() < dateNative.getTime()) {
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

  getWinColor(winProbability: number): string {
    let red = 0;
    let green = 0;
    if (winProbability >= 50) {
      red = Math.max(Math.floor(255 - (10 * (winProbability - 50))), 0);
      green = 255;
    } else {
      red = 255;
      green = Math.max(Math.floor(255 - (10 * (50 - winProbability))), 0);
    }
    return 'rgba(' + red + ',' + green + ', 0, .8)';
  }

}
