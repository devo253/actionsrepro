import { Component, AfterViewChecked } from '@angular/core';

declare let paypal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  addScript: boolean;

  constructor() { }

  renderButtons() {
    paypal.Buttons({

      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '0.01'
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          // Do something when payment is successful.
        });
      },

      // onInit is called when the button first renders
      onInit: (data, actions) => {

        // Disable the buttons
        actions.disable();

        document.querySelector('#email')
          .addEventListener('change', (event) => {

            const email = (event.target as HTMLInputElement).value;
            // tslint:disable-next-line:max-line-length
            const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const valid = validEmailRegEx.test(email);
            if (valid) {
              actions.enable();
              console.log('actions enabled');
            } else {
              actions.disable();
              console.log('actions.disabled');
            }
          });

      },

      onClick: (data, actions) => {
        //  this.toggleValidationMessage();
      },
    }).render('#paypal-button-container');

  }

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        this.renderButtons();
      });
    }
  }

  addPaypalScript(): Promise<any> {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      const scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=sb';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

}

