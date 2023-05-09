import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Signup } from '../interface/signup';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  fullname= '';email='';password=''; verifyPassword='';
  message:string = '';
  passwordType = 'password';
  isPasswordVisible = false;
  constructor(private http: HttpClient, private router: Router) { }
  submit(){
    const data = {
      fullname: (<HTMLInputElement>document.getElementById('fullname')).value,
      email: (<HTMLInputElement>document.getElementById('inputEmail3')).value,
      password: (<HTMLInputElement>document.getElementById('inputPassword3')).value,
      verifyPassword: (<HTMLInputElement>document.getElementById('inputPassword4')).value
    };
    this.http.post('http://localhost:5000/api/signup', data).subscribe((response:any) => {
    console.log(response);
    this.message = response.message;
    if (response.status === 201) {
      // Redirect the user to the login page
      alert("Registered Succefully!")
  }
  });
  }
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordType = this.isPasswordVisible ? 'text' : 'password';
}
}