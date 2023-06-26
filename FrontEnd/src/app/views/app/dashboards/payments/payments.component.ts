import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';


@Component({
    selector: 'app-payment',
    templateUrl: './payments.component.html',
    styleUrls:['./payments.component.css']
  })
  export class PaymentsComponent {
    paymentMethodResponse;
    amount : number =0;
    url ="";

    constructor(private route: ActivatedRoute,
        private router: Router,private httpClient: HttpClient){

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
          console.log(params.amount);
          this.amount = params.amount;
        });

        this.httpClient.get("https://localhost:44321/Payment/MethodofPayment").
        subscribe(result=>{
           this.paymentMethodResponse = result;
        
   
   //      var paymentMethodsResponse =
   //  {"groups":[{"name":"Credit Card","types":["mc","visa","amex","cup","diners","discover","jcb","maestro"]}],"paymentMethods":[{"details":[{"key":"number","type":"text"},{"key":"expiryMonth","type":"text"},{"key":"expiryYear","type":"text"},{"key":"cvc","type":"text"},{"key":"holderName","optional":true,"type":"text"}],"name":"Credit Card","type":"scheme","brands":["mc","visa","amex","cup","diners","discover","jcb","maestro"]},{"name":"UnionPay","supportsRecurring":true,"type":"unionpay"},{"details":[{"key":"applepay.token","type":"applePayToken"}],"name":"Apple Pay","supportsRecurring":true,"type":"applepay"},{"details":[{"key":"number","type":"text"},{"key":"expiryMonth","type":"text"},{"key":"expiryYear","type":"text"},{"key":"cvc","type":"text"},{"key":"holderName","optional":true,"type":"text"},{"key":"telephoneNumber","optional":true,"type":"text"}],"name":"ExpressPay","supportsRecurring":true,"type":"cup"}]};
       var configuration = {
       
         paymentMethodsResponse: this.paymentMethodResponse , // The `/paymentMethods` response from the server.
         clientKey: "test_3F3QDUQJENCL3EY5E7YPSILGIY2TJA2K", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
         locale: "en-US",
         environment: "test",
         onSubmit: (state, dropin) => {
       this.httpClient.post("https://localhost:44389/Payment/Payments",state.data).
        subscribe(response=>{
            this.url = "app/paymentsummary";
            this.router.navigateByUrl(this.url);
                 // if (response.action) {
                 //   // Drop-in handles the action object from the /payments response
                 //   dropin.handleAction(response.action);
                 // } else {
                 //   // Your function to show the final result to the shopper
                 //   //showFinalResult(response);
                 // }
               })
           },
         
         paymentMethodsConfiguration: {
           card: { // Example optional configuration for Cards
             hasHolderName: true,
             holderNameRequired: true,
             enableStoreDetails: true,
             hideCVC: false, // Change this to true to hide the CVC field for stored cards
             name: 'Credit or debit card',
             amount:{ value: this.amount*100, currency: 'USD' },
           }
         }
         
   
   
        };
       
        
        
       
        const checkout = new AdyenCheckout(configuration);
        const dropin = checkout.create('dropin').mount('#dropin-container');
       });
       
     }
     title = 'AdyenDropin';
   
     makePayment(){
       var paymentResponse = {
   
       };
       return paymentResponse; 
     
      }

  }