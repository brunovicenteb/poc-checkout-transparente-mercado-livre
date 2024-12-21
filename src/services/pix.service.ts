import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../enviroment';
import { PixRequestModel } from 'src/models/pixRequestModel';

@Injectable({
  providedIn: 'root'
})
export class PixService {
  private readonly baseURL = enviroment.backendURL;
  constructor(private httpClient: HttpClient) { }

  cobrarPix(pixRequest: PixRequestModel){
    return this.httpClient.post<PixRequestModel>(`${this.baseURL}/pix`, pixRequest);
  }
}
