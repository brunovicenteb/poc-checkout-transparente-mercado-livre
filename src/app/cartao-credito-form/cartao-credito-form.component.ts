import { Component } from '@angular/core';
import { MercadoPagoService } from '../../services/mercadoPagoService.service';
import { CreditCardService } from 'src/services/creditCard.service';
import { CreditCardRequest } from 'src/models/creditCardRequest';


@Component({
  selector: 'app-cartao-credito-form',
  templateUrl: './cartao-credito-form.component.html',
  styleUrls: ['./cartao-credito-form.component.css']
})

export class CartaoCreditoFormComponent {
constructor(private mercadopagoService: MercadoPagoService, private creditCardService: CreditCardService) {}

transactionResult: any;

async ngOnInit() {
  await this.mercadopagoService.initialize();
  const mpInstance = this.mercadopagoService.getMercadoPagoInstance();

  const cardForm = mpInstance.cardForm({
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

        console.error('Token:', creditCardRequest.token);

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
      },
      onFetching: (resource) => {
        console.log("Fetching resource: ", resource);

        // Animate progress bar
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
}
