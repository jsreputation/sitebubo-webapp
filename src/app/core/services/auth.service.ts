import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginResponse, User } from '../models/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn);

  user: User;
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);

  set accessToken(value: string) {
    this.localStorage.set(environment.localStorage.accessToken, value);
  }

  get accessToken(): string {
    return this.localStorage.get(environment.localStorage.accessToken);
  }

  get isLoggedIn(): boolean {
    return Boolean(this.accessToken);
  }

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }


  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${environment.api}/auth/login`;
    return this.http.post<LoginResponse>(url, { email, password }).pipe(tap(res => {
      
    }))
  }

  signup(fullname: string, email: string, password: string): Observable<boolean> {
    const url = `${environment.api}/auth/signup`;
    return this.http.post<boolean>(url, { fullname, email, password }).pipe(tap(res => {
      
    }));
  }

  logout() {
    this.accessToken = null;
    this.isLoggedIn$.next(this.isLoggedIn);
    this.user = null;
    this.user$.next(this.user);
    this.router.navigate(['']);
  }

  forgetPassword(email: string): Observable<any> {
    const url = `${environment.api}/auth/forgot-password`;
    return this.http.post(url, { email });
  }

  resetPassword(password: string, resetToken: string): Observable<any> {
    const url = `${environment.api}/auth/reset-password`;
    return this.http.post(url, {password, resetToken});
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const url = `${environment.api}/auth/change-password`;
    return this.http.post(url, {oldPassword, newPassword});
  }

  verifyEmail(verifyToken: string): Observable<any> {
    const url = `${environment.api}/auth/verify`;
    return this.http.post(url, {verifyToken}).pipe(
      tap(() => {
        if (this.user) {
          this.user.isEmailVerified = true;
          this.user$.next(this.user);
        }
      })
    );
  }

  resendVerificationEmail(): Observable<any> {
    const url = `${environment.api}/auth/resend-verification`;
    return this.http.post(url, null);
  }

  getAuth(): Observable<User> {
    const url = `${environment.api}/auth`;
    return this.http.get<User>(url).pipe(
      tap(res => {
        this.user = res;
        this.user$.next(this.user);
      })
    );
  }

  authenticateUser(token: string) {
    this.accessToken = token;
    this.isLoggedIn$.next(this.isLoggedIn);
    this.getAuth().toPromise();
  }
}
