import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherValuesComponent } from './current-weather-values.component';

describe('CurrentWeatherValuesComponent', () => {
    let component: CurrentWeatherValuesComponent;
    let fixture: ComponentFixture<CurrentWeatherValuesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CurrentWeatherValuesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrentWeatherValuesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
