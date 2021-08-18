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
  teamColors = new Map();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<DateProjections>(`${environment.apiUrl}/results/projections`).subscribe(data =>
      {
        this.games = data.games;
        this.currentDate = new Date(data.date);
        this.setDateString(this.currentDate);
      }
    );
    this.setTeamColors();
  }

  setDateString(date: Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    this.dateString = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  setTeamColors() {
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
    this.teamColors.set('Oakland Athletics', 'rgba(0, 56, 49, .8)');
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

  getWinColor(winProbability: number) {
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
