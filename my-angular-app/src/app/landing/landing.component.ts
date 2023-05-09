import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],

})
export class LandingComponent implements OnInit{
  constructor(private router: Router) { }

  goToLogin() {
    this.router.navigate(['/login']);
  }


  ngOnInit(): void {
    const typed = new Typed('.typing', {
      strings: ['Unlock the potential of your sales pipeline'],
      typeSpeed: 80,
      backSpeed: 40,
      showCursor: false,
      cursorChar: '|',
      loop: false,
      onComplete: function(self) {
        const p = document.querySelector('p');
        p?.classList.remove('hide');
      }
    });
    const typed2 = new Typed('.type', {
      strings: ['By accurately forecasting your sales and tracking your progress in real-time, you can identify opportunities for growth and make strategic decisions that help you stay ahead of the competition.'],
      typeSpeed: 40,
      backSpeed: 10,
      showCursor: false,
      cursorChar: '|',
      loop: false,
      onComplete: function(self) {
        const button = document.querySelector('button');
        button?.classList.remove('hidden');
        button?.classList.add('visible');
      }
    });
  }
}
