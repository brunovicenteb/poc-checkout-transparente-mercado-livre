import { NgModule } from '@angular/core';
import { CartaoCreditoFormComponent } from './cartao-credito-form/cartao-credito-form.component';
import { PixComponent } from './pix/pix.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'cartao-credito', component: CartaoCreditoFormComponent },
  { path: 'pix', component: PixComponent },
  { path: '', redirectTo: '/cartao-credito', pathMatch: 'full' },
  { path: '**', redirectTo: '/cartao-credito' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule  { }
