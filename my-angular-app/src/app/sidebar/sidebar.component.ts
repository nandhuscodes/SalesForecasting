import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  file: File | undefined;
  filename = '';
  isDropZoneOver = false;
  datasetName = '';
  timeRange = 0;
  periodicity = '';
  chartData: any;
  csvFile = '';
  accuracy = 0;
  isFileDropped = false; // declare and initialize the variable here
  @Output() chartDataChange = new EventEmitter<string>();
  @Output() accuracyChange = new EventEmitter<number>();
  constructor(private http: HttpClient) { }
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }
  isDragOver = false;

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.file = file;
      this.isFileDropped = true;
      this.filename = file.name;
    }
  }
  
  onSubmit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      const url = 'http://localhost:5000/upload';
      this.http.post(url, formData).subscribe((response:any) => {
          console.log(response);
          this.datasetName = response.file;
          console.log(this.datasetName);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  Submit() {
    const data = {
      datasetName: this.datasetName,
      timeRange: this.timeRange,
      periodicity: this.periodicity
    };
    this.http.post<any>('http://localhost:5000/api/forecast', data).subscribe(response => {
      const encodedImage = 'data:image/png;base64,' + response.forecast;
      this.chartDataChange.emit(encodedImage);
      this.accuracyChange.emit(response.accuracy);
      this.csvFile = response.csv_file;
    });
  }

}
