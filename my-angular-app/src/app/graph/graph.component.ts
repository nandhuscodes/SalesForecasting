import { Component, OnInit } from '@angular/core';
import { Chart,  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.http.get('assets/data.csv', { responseType: 'text' }).subscribe(
      data => {
        const sales = [];
        const predictedSales = [];
        const dates = [];
        const rows = data.split('\n');
        let prevDate = '';
        let prevSales = 0;
        let prevPredSales = 0;
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(',');
          if (cols.length < 3) continue;
          const currDate = cols[0];
          const currSales = Number(cols[1]);
          let currPredSales = Number(cols[2]);
          if (currDate === prevDate) {
            prevSales = currSales ? currSales : prevSales;
            prevPredSales = currPredSales ? currPredSales : prevPredSales;
          } else {
            if (prevDate) {
              sales.push(prevSales !== 0 ? prevSales : null);
              predictedSales.push(prevPredSales || prevSales);
              dates.push(prevDate);
            }
            prevDate = currDate;
            prevSales = currSales;
            prevPredSales = currPredSales;
          }
        }
        if (prevDate) {
          sales.push(prevSales !== 0 ? prevSales : null);
          predictedSales.push(prevPredSales || prevSales);
          dates.push(prevDate);
        }
        this.plotChart(dates, sales, predictedSales);
      },
      err => console.error(err)
    );
  }
  


plotChart(dates: string[], sales: (number | null)[], predictedSales: number[]) {
  const canvas = (document.getElementById('myChart') as HTMLCanvasElement);
  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx!, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Actual Sales',
          data: sales,
          fill: false,
          borderColor: sales.map(s => s === 0 ? 'white' : 'rgb(255, 99, 132)'),
          pointBackgroundColor: sales.map(s => s === 0 ? 'white' : 'rgb(255, 99, 132)')
        },
        {
          label: 'Predicted Sales',
          data: predictedSales,
          fill: false,
          borderColor: 'rgb(54, 162, 235)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  chart.update();
}

}
