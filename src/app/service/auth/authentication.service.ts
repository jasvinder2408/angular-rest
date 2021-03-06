import { API_URL } from '../../app.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import {map} from 'rxjs/operators';
import { UserInfo } from '../../entity/user-info';


export const TOKEN = 'token'
export const AUTHENTICATED_USER = 'authenticaterUser'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //    receivedFilter: EventEmitter<string>; 
  // Sbject is more better than EventEmitter<>
  //receivedFilter: Subject<string>;
  receivedFilter: EventEmitter<String>;

  constructor(private http: HttpClient) { 
       this.receivedFilter = new EventEmitter<string>();
  }


  // Useful for JWT authentication
  executeJWTAuthenticationService(username, password) {
    
    return this.http.post<any>(
      `${API_URL}/authenticate`,{
        username,
        password
      }).pipe(
        map(
          data => {
            sessionStorage.setItem(AUTHENTICATED_USER, username);
            sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);

        }
        )
      );
  }



  executeRegister(user:UserInfo){
    return this.http.post(
              `${API_URL}/register/createUser/`,user
                );
  }

  // useful for Basic authentication 
  executeAuthenticationService(username, password) {
    
    let basicAuthHeaderString = 'Basic ' + window.btoa(username + ':' + password);

    let headers = new HttpHeaders({
        Authorization: basicAuthHeaderString
      })

    return this.http.get<AuthenticationBean>(
      `${API_URL}/basicauth`,
      {headers}).pipe(
        map(
          data => {
            sessionStorage.setItem(AUTHENTICATED_USER, username);
            sessionStorage.setItem(TOKEN, basicAuthHeaderString);
            return data;
          }
        )
      );
    //console.log("Execute Hello World Bean Service")
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER)
  }

  getAuthenticatedToken() {
    if(this.getAuthenticatedUser())
      return sessionStorage.getItem(TOKEN)
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(AUTHENTICATED_USER)
    return !(user === null)
  }

  logout(){
    sessionStorage.removeItem(AUTHENTICATED_USER)
    sessionStorage.removeItem(TOKEN)
  }

  sendUserNameEvent(loggedInUser: string): void {
    this.receivedFilter.emit(loggedInUser);
   // this.receivedFilter.next(loggedInUser);
}

  
}

export class AuthenticationBean{
  constructor(public message:string) { }
}