import { Injectable } from '@angular/core';
import { Race } from '../interfaces/race';
import { Poney } from '../interfaces/poney';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _races: Race[] = []
  private _ponies: Poney[] = []
  API_URL: string = 'http://localhost:3000'

  get ponies(): Observable<Poney[]> {
    // return ponies if already requested
    return (this._ponies && this._ponies.length) ?
      of(this._ponies) :
      this.http.get(`${this.API_URL}/ponies`)
        .pipe(map(ponies => {
          this._ponies = <Poney[]>ponies
          return <Poney[]>ponies
        }))
  }

  get races(): Observable<Race[]> {
    let obs$: Observable<Race[]>

    if (this._races && this._races.length) {
      obs$ = of(this._races)
      
      // new Observable((observer) => {
      //   observer.next(this._races)
      // })
    } else {
      obs$ = this.http.get(`${this.API_URL}/races`)
      .pipe(map(races => {
        // save races
        this._races = <Race[]>races

        return <Race[]>races
      }))
    }

    return obs$
  }

  getRaceById(id: string): Observable<Race> {
    return this.races.pipe(map(races => {
      return races.find(race => {
        return race.id === id
      })
    }))
  }

  createRace(race: Race): Observable<Race> {
    return this.http.post(`${this.API_URL}/races`, race)
      .pipe(map(response => {
        this._races.push(<Race>response)
        return <Race>response
      }))
  }

  createPoney(poney: Poney): Observable<Poney> {
    return this.http.post(`${this.API_URL}/ponies`, poney)
      .pipe(map(response => {
        this._ponies.push(<Poney>response)
        return <Poney>response
      }))
  }

  constructor(private http: HttpClient) {}
}
