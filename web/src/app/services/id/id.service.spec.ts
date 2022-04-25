import { TestBed } from '@angular/core/testing';

import { IDService } from './i-d.service';

describe('IdService', () => {
    let service: IDService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IDService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
