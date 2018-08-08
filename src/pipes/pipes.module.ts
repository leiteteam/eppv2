import { NgModule } from '@angular/core';
import { PayStatusPipe } from './pay-status/pay-status';
import { StockStatusPipe } from './stock-status/stock-status';
import { TydatePipe } from './tydate/tydate';
import { ParseFloatPipe } from './parse-float/parse-float';
import { StockPrewarningStatusPipe } from './stock-prewarning-status/stock-prewarning-status';
import { FloatSpliterPipe } from './float-spliter/float-spliter';
import { ParseAmountPipe } from './parse-amount/parse-amount';
import { ProductStatusPipe } from './product-status/product-status';
import { StockNamePipe } from './stock-name/stock-name';
import { PointTypePipe } from './point-type/point-type';
import { InvestigationTypePipe } from './investigation-type/investigation-type';
import { SpleCodePipe } from './sple-code/sple-code';
@NgModule({
	declarations: [
        PayStatusPipe,
        StockStatusPipe,
        TydatePipe,
        ParseFloatPipe,
        StockPrewarningStatusPipe,
        FloatSpliterPipe,
        ParseAmountPipe,
        ProductStatusPipe,
        StockNamePipe,
        PointTypePipe,
    InvestigationTypePipe,
    SpleCodePipe
    ],
	imports: [],
	exports: [
        PayStatusPipe,
        StockStatusPipe,
        TydatePipe,
        ParseFloatPipe,
        StockPrewarningStatusPipe,
        FloatSpliterPipe,
        ParseAmountPipe,
        ProductStatusPipe,
        StockNamePipe,
        PointTypePipe,
    InvestigationTypePipe,
    SpleCodePipe
    ]
})
export class PipesModule {}
