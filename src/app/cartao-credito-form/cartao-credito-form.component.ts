import { Component } from '@angular/core';
import { MercadoPagoService } from '../../services/mercadoPagoService.service';
import { CreditCardService } from '../../services/creditCard.service';
import { CreditCardRequest } from '../../models/creditCardRequest';

@Component({
  selector: 'app-cartao-credito-form',
  templateUrl: './cartao-credito-form.component.html',
  styleUrls: ['./cartao-credito-form.component.css']
})

export class CartaoCreditoFormComponent {
  transactionResult: any;
  mpInstance: any;

  constructor(private mercadopagoService: MercadoPagoService, private creditCardService: CreditCardService) { }

  async ngOnInit() {
    await this.mercadopagoService.initialize();
    this.mpInstance = this.mercadopagoService.getMercadoPagoInstance();
    await this.initializeMercadoPago();
  }

  async initializeMercadoPago() {
    const cardForm = this.mpInstance.cardForm({
      amount: "1.5",
      iframe: true,
      form: {
        id: "form-checkout",
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do Cartão",
        },
        expirationDate: {
          id: "form-checkout__expirationDate",
          placeholder: "Data de Expiração (MM/YY)",
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: "Código de Segurança",
        },
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Nome do Titular",
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: "Bandeira",
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Número de Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de Documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Documento",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "Email",
        },
      },
      callbacks: {
        onFormMounted: error => {
          if (error) return console.warn("Form Mounted handling error: ", error);
        },
        onSubmit: event => {
          event.preventDefault();
          this.processPayment(cardForm);
        },
        onFetching: (resource) => {
          console.log("Fetching resource: ", resource);
          const progressBar: HTMLProgressElement | null = document.querySelector(".progress-bar");
          if (progressBar) {
            progressBar.removeAttribute("value");
          }
          return () => {
            if (progressBar) {
              progressBar.setAttribute("value", "0");
            }
          };
        }
      },
    });
  }

  async processPayment(cardForm: any) {
    const {
      paymentMethodId: payment_method_id,
      issuerId: issuer_id,
      cardholderEmail: email,
      amount,
      token,
      installments,
      identificationNumber,
      identificationType,
    } = cardForm.getCardFormData();

    const creditCardRequest: CreditCardRequest = {
      token,
      email,
      description: "Capa para notebook",
      paymentMethodId: payment_method_id,
      installments: Number(installments),
      number: identificationNumber,
      type: identificationType,
      transactionAmount: Number(amount),
    };

    console.log('Token:', creditCardRequest.token);

    this.creditCardService.cobrarCartao(creditCardRequest).subscribe(
      (response: any) => {
        console.log('Resposta do servidor:', response);
        this.transactionResult = response;
      },
      (err) => {
        console.error('Erro ao cobrar cartao de credito:', err);
        this.transactionResult = { error: err };
      }
    );
  }
}
