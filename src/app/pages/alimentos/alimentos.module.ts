import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlimentosPageRoutingModule } from './alimentos-routing.module';

import { AlimentosPage } from './alimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AlimentosPageRoutingModule
  ],
  declarations: [AlimentosPage]
})
export class AlimentosPageModule {}
