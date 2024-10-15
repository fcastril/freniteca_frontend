import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _statusSession: Subject<boolean> = new Subject<boolean>();
  
  getStatusSession() {
    return this._statusSession;
  }

  startSession() {
    this._statusSession.next(true);
  }
}
