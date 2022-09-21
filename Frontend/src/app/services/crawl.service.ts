import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prof } from '../models/prof.model';
import { uhr, uhren } from '../models/uhr.model';

@Injectable({
  providedIn: 'root'
})
export class CrawlService {

  constructor(private http: HttpClient) { }

  getProfs(){
    return this.http.get('http://localhost:3000/profs');
  }

  getAllUhren():Observable<uhren>{
    return this.http.get<uhren>('http://localhost:3000/uhren');
  }

  saveUhrIntoDB(uhr:uhr){
    return this.http.post<uhr>('http://localhost:3000/save',uhr);
  }
}
