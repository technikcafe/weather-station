import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IDService {
    private currentID = 0;

    public getID(): number {
        return this.currentID++;
    }
}
