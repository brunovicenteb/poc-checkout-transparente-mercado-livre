import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { PixRequestModel } from '../../models/pixRequestModel';
import { PixService } from '../../services/pix.service';

@Component({
  selector: 'app-pix',
  templateUrl: './pix.component.html',
  styleUrls: ['./pix.component.css'],
})

export class PixComponent implements OnInit {
  constructor(private pixService: PixService) { }
  isBuying: boolean = true;
  randomKey: string;
  qrCode: string;
  expirationDate: string;

  MockBody = {
    email: "casa@docame.com",
    description: "Mestre Kame",
    transactionAmount: 1,
  }

  ngOnInit(): void {
    this.restartPixProcess();
  }

  gerarPix() {
    const pixRequest: PixRequestModel = {
      email: "teste@teste.com",
      description: "Hamburguer de Siri",
      transactionAmount: 1
    };

    this.pixService.cobrarPix(pixRequest).subscribe(
      (response: any) => {
        this.isBuying = false;
        this.randomKey = response.randomKey;
        this.qrCode = `data:image/jpg;base64,${response.qrCode}`;
        this.expirationDate = response.dateOfExpiration;
      },
      (error) => {
        console.error('Erro ao cobrar Pix:', error);
      }
    );
  }

  restartPixProcess() {
    this.randomKey = undefined;
    this.qrCode = undefined;
    this.randomKey = undefined;
    this.expirationDate = undefined;
    this.isBuying = true;
  }

  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text; // Define o texto que será copiado
    document.body.appendChild(textarea);
    textarea.select(); // Seleciona o texto
    document.execCommand('copy'); // Copia para área de transferência
    document.body.removeChild(textarea); // Remove o textarea temporário
    alert('Chave copiada para a área de transferência!'); // Notificação simples
  }

}
