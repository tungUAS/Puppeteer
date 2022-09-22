import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { prof } from '../models/prof.model';
import { Uhr, Uhren } from '../models/uhr.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CrawlService {

  constructor(private http: HttpClient,
              private config: ConfigService) { }

  getProfs(){
    return this.http.get('http://localhost:3000/profs');
  }

  getAllUhren():Observable<Uhren>{
    return this.http.get<Uhren>('http://localhost:3000/uhren/get');
  }

  saveUhrIntoDB(uhr:Uhr):Observable<Uhr>{
    return this.http.post<Uhr>('http://localhost:3000/uhren/save',uhr).pipe();
  }
}
