import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fruits } from './interface/fruits';

@Injectable({
  providedIn: 'root'
})
export class FruitsService {

  constructor(private http: HttpClient) { }
  addFruits(data:any): Observable<any>{
    return this.http.post('http://localhost:3000/fruits', data);
  }

  getFruits(): Observable<any>{
    return this.http.get('http://localhost:3000/fruits');
  }

  deleteFruits(id: number): Observable<Fruits> {
    return this.http.delete<Fruits>('http://localhost:3000/fruits/' + id);
  }

  updateFruits(id : number, fruits : Fruits): Observable<Fruits> {
    return this.http.put<Fruits>('http://localhost:3000/fruits/' + id, fruits);
  }
}
