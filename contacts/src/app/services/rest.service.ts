import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectModelInitializer } from '../config/ObjectModelInitializer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpFileOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class RestService {
  // Utilidades
  AUTH: any;

  constructor(private http: HttpClient, private router: Router, public objectModelInitializer: ObjectModelInitializer) {
    this.AUTH = {
      TOKEN_AUTH_USERNAME: this.objectModelInitializer.getConst().tokenUsernameAUTH,
      TOKEN_AUTH_PASSWORD: this.objectModelInitializer.getConst().tokenPasswordAUTH,
      TOKEN_AUTH_NAME: this.objectModelInitializer.getConst().tokenNameAUTH
    };
  }

  // SERVICES WITHOUT SECURITY
  getREST(url) {
    return this.http.get(url);
  }

  postREST(url, data) {
    return this.http.post(url, data);
  }

  putREST(url, data) {
    return this.http.put(url, data);
  }

  deleteREST(url, id) {
    let idParam = '{' + id + '}';

    return this.http.delete(`${url}/${idParam}`);
  }

  getFileREST(url) {
    return this.http.get(url, { responseType: 'blob' });
  }

  postFileREST(url, data: File) {
    let formData: FormData = new FormData();
    formData.append('file', data);

    return this.http.post(url, formData, { responseType: 'text' });
  }
  // END SERVICES WITHOUT SECURITY

  // SERVICES WITH SECURITY
  postOauthREST(url, usuario: string, clave: string) {
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(clave)}`;

    return this.http.post(url, body, {
      headers: new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(this.AUTH.TOKEN_AUTH_USERNAME + ':' + this.AUTH.TOKEN_AUTH_PASSWORD))
    });
  }

  getSecureREST(url, token) {
    return this.http.get(url, {
      headers: new HttpHeaders().set('Authorization', 'bearer ' + token).set('Content-Type', 'application/json')
    });
  }

  postSecureREST(url, data, token) {
    return this.http.post(url, data, {
      headers: new HttpHeaders().set('Authorization', 'bearer ' + token).set('Content-Type', 'application/json')
    });
  }

  postSecureFileREST(url, data: File, token) {
    let formData = new FormData();
    formData.append("file", data);

    return this.http.post(url, formData, {
      headers: new HttpHeaders().set('Authorization', 'bearer ' + token)
    });
  }
  // END SERVICES WITH SECURITY
}
