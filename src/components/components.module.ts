import { NgModule } from '@angular/core';
import { BtnComponent } from './btn/btn';
import { IconComponent } from './icon/icon';
import { SplitComponent } from './split/split';
@NgModule({
	declarations: [BtnComponent,
    IconComponent,
    SplitComponent],
	imports: [],
	exports: [BtnComponent,
    IconComponent,
    SplitComponent]
})
export class ComponentsModule {}
