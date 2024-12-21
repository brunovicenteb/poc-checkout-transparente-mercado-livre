import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PaymentCheckout';

    navigateToCreditCard() {
      window.location.href = '/cartao-credito';
    }

    navigateToPix() {
      window.location.href = '/pix';
    }
}
