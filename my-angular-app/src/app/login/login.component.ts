import { Component } from '@angular/core';
import { contact } from '../interface/contact';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/*import { HttpClient } from '@angular/common/http';*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  person: contact = {email:'',password:''}
  passwordType = 'password';
  isPasswordVisible = false;
  constructor(private http: HttpClient, private router: Router) {}
  message: string = ''
  /*constructor(private http: HttpClient) {}*/
  submit():void{
    const payload = { email: this.person.email, password: this.person.password };
    
    this.http.post('http://localhost:5000/api/login', payload).subscribe((response:any) => {
      console.log(response);
      if(response.success){
        this.router.navigate(['/dashboard']);
      } else{
        this.message = response.error;
      }
    });
  }
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordType = this.isPasswordVisible ? 'text' : 'password';
}
}
