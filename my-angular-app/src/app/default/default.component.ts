import { Component } from '@angular/core';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.8s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('letterMove', [
      transition(':enter', [
        // Use keyframes to define the animation
        animate('.8s ease-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-50px)', offset: 0.1 }),
          style({ transform: 'translateY(0)', offset: 0.2 }),
          style({ transform: 'translateY(-30px)', offset: 0.3 }),
          style({ transform: 'translateY(0)', offset: 0.4 }),
          style({ transform: 'translateY(-15px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 0.6 }),
          style({ transform: 'translateY(-5px)', offset: 0.7 }),
          style({ transform: 'translateY(0)', offset: 1 }),
        ]))
      ])
    ]),
    trigger('hoverZoom', [
      state('normal', style({
        transform: 'scale(1)',
      })),
      state('hover', style({
        transform: 'scale(1.2)',
      })),
      transition('normal => hover', [
        animate('.3s ease-out')
      ]),
      transition('hover => normal', [
        animate('.3s ease-out')
      ])
    ])
    
  ]
})
export class DefaultComponent {
  zoomState = 'normal';

}
