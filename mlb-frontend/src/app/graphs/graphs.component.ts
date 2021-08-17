import { Component, ElementRef, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HistoricalOdds } from '../_models/result.model';
import { AppModule } from '../../app/app.module';
import { ISeriesRenderEventArgs } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  historicalOdds: HistoricalOdds[] = [];
  odds: { date: Date, value: number, }[][] = [];
  yankeeOdds = [];
  primaryXAxis = {valueType: 'DateTime', labelFormat: 'MMM d'};
  primaryYAxis = {minimum: 0, maximum: 100};
  palettes: string[][] = [];
  // see if you can make the selection box multi tier (division => team)
  teams = ['Yankees', 'Red Sox', 'Blue Jays', 'Rays', 'Orioles',
          'White Sox', 'Indians', 'Tigers', 'Royals', 'Twins',
          'Astros', 'Angels', 'Athletics', 'Mariners', 'Rangers',
          'Braves', 'Marlins', 'Mets', 'Phillies', 'Nationals',
          'Cubs', 'Reds', 'Brewers', 'Pirates', 'Cardinals',
          'Diamondbacks', 'Rockies', 'Giants', 'Padres', 'Dodgers'];
  leagues = ['ALE', 'ALC', 'ALW', 'NLE', 'NLC', 'NLW'];
  currentIndex = 0;
  legendSettings = {visible: true, position: 'Bottom'};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<HistoricalOdds[]>(`${environment.apiUrl}/results/date`).subscribe(data =>
      {
        this.historicalOdds = data;
        this.setOdds();
        this.setPalettes();
      }
    );
  }

  setOdds(): void {
    for (let i = 0; i < this.historicalOdds.length; i++) {
      const teamOdds = this.historicalOdds[i].teamResults;
      const curDate = this.historicalOdds[i].date;
      for (let j = 0; j < teamOdds.length; j++) {
        const json = {
          date: new Date(curDate),
          value: teamOdds[j].odds,
          teamIndex: j
        };
        if (i === 0) {
          const arr = [json];
          this.odds.push(arr);
        } else {
          this.odds[j].push(json);
        }
      }
    }
    console.log(this.odds);
  }

  setPalettes(): void {
    this.palettes.push(['rgb(0, 48, 135)', 'rgb(189, 48, 57)', 'rgb(19, 74, 142)', 'rgb(143, 188, 230)', 'rgb(223, 70, 1)']);
    this.palettes.push(['rgb(39, 37, 31)', 'rgba(12, 35, 64)', 'rgb(12, 35, 60)', 'rgb(0, 70, 135)', 'rgb(0, 43, 92)']);
    this.palettes.push(['rgb(235, 110, 31)', 'rgb(186, 0, 33)', 'rgb(0, 56, 49)', 'rgb(0, 92, 92)', 'rgb(0, 50, 120)']);
    this.palettes.push(['rgb(206, 17, 65)', 'rgb(65, 116, 141)', 'rgb(0, 45, 114)', 'rgb(232, 24, 40)', 'rgb(171, 0, 3)']);
    this.palettes.push(['rgb(14, 51, 134)', 'rgb(198, 1, 31)', 'rgb(255, 197, 47)', 'rgb(253, 184, 39)', 'rgb(196, 30, 58)']);
    this.palettes.push(['rgb(167, 25, 48)', 'rgb(51, 0, 111)', 'rgb(253, 90, 30)', 'rgb(255, 196, 37)',  'rgb(0, 90, 156)']);
  }

  change(teamName): void {
    this.currentIndex = 5 * this.leagues.indexOf(teamName);
  }

  seriesRender(args: ISeriesRenderEventArgs): void {
    args.series.name = this.teams[args.data[0].teamIndex];
  }

}
