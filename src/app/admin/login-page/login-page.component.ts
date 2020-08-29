import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  isSubmitting = false;
  message: string;

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Сессия истекла, пожалуйста авторизуйтесь снова';
      } else if (params['authFailed']) {
        this.message = 'Сессия снова истекла, пожалуйста авторизуйтесь снова';
      }
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(user).subscribe(
      () => {
        this.loginForm.reset();
        this.router.navigate(['/admin', 'dashboard']);
        this.isSubmitting = false;
      },
      () => {
        this.isSubmitting = false;
      }
    );

  }
}
