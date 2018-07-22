import { PipesModule } from './../pipes/pipes.module';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonTyfunctionGridComponent } from './ion-tyfunction-grid/ion-tyfunction-grid';
import { IonAllitemShowedBottomComponent } from './ion-allitem-showed-bottom/ion-allitem-showed-bottom';
import { IonCustomEmptyComponent } from './ion-custom-empty/ion-custom-empty';
import { JlRabtnComponent } from './jl-rabtn/jl-rabtn';
import { JlCheckboxComponent } from './jl-checkbox/jl-checkbox';
import { JlStartendDatepickerItemComponent } from './jl-startend-datepicker-item/jl-startend-datepicker-item';
import { PhotoItemComponent } from './photo-item/photo-item';
import { ImgLazyLoadComponent } from './img-lazy-load/img-lazy-load';
import { PicItemComponent } from './pic-item/pic-item';

@NgModule({
	declarations: [IonTyfunctionGridComponent,
    IonAllitemShowedBottomComponent,
    IonCustomEmptyComponent,
    JlRabtnComponent,
    JlCheckboxComponent,
    JlStartendDatepickerItemComponent,
    JlStartendDatepickerItemComponent,
    PhotoItemComponent,
    ImgLazyLoadComponent,
    PicItemComponent],

	imports: [IonicModule,PipesModule],
	exports: [IonTyfunctionGridComponent,

    IonAllitemShowedBottomComponent,
    IonCustomEmptyComponent,
    JlRabtnComponent,
    JlCheckboxComponent,
    JlStartendDatepickerItemComponent,
    JlStartendDatepickerItemComponent,
    PhotoItemComponent,
    ImgLazyLoadComponent,
    PicItemComponent]

})
export class ComponentsModule {}
