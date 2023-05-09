import { Component, OnInit } from '@angular/core';
import {Chart,  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale} from 'chart.js/auto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  chartData!: string;
  accuracy!: number;
  accuracyChart: Chart | undefined;
  chart: Chart | undefined;
  prev=0;
  pieChart: any;
  constructor(private router: Router,private http: HttpClient) { }
  

  ngOnInit(): void {
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
  if (this.chart) {
    this.chart.data.labels = dates;
    this.chart.data.datasets[0].data = sales;
    this.chart.data.datasets[1].data = predictedSales;
    this.chart.update();
  } else {
    const canvas = (document.getElementById('myChart') as HTMLCanvasElement);
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Actual Sales',
            data: sales,
            fill: false,
            borderColor: sales.map(s => s === 0 ? 'white' : 'rgba(79, 118, 99, 1)'),
            pointBackgroundColor: sales.map(s => s === 0 ? 'white' : 'rgba(79, 118, 99, 1)')
          },
          {
            label: 'Predicted Sales',
            data: predictedSales,
            fill: false,
            borderColor: 'rgba(147, 218, 169, 1)'
          }
        ]
      }
    });
  }
}


  onChartDataChange(data: string) {
    this.chartData = data;
    this.loadData();
  }

  onAccuracyChange(data: number) {
    this.accuracy = data;
    this.pie(data);
  }
  pie(accuracy: number) {
    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = [accuracy, 100 - accuracy];
      this.pieChart.update();
    } else {
      this.pieChart = new Chart('pieChart', {
        type: 'doughnut',
        data: {
          labels: ["Accuracy", "Still to achieve"],
          datasets: [{
            label: "Accuracy",
            data: [accuracy, 100 - accuracy],
            backgroundColor: [
              'rgba(79, 118, 99, 1)',
              'rgba(147, 218, 169, 0.5)'
            ]
          }]
        },
        options:{
          aspectRatio:2.5
        }
      });
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  downloadCSV() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'assets/data.csv');
    link.setAttribute('download', 'data.csv');
    link.click();
  }
  
}
