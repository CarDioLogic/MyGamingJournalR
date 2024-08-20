import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  IonInput,
  IonHeader,
  IonButton,
  IonItem,
  IonLabel,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonContent,
    IonLabel,
    IonItem,
    IonButton,
    IonHeader,
    IonInput,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    console.log();
    this.intializeLoginForm();
  }
  intializeLoginForm() {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const credentials = this.loginForm.value;
    this.authService.login(credentials.name, credentials.password).subscribe({
      next: (loggedUser) => {
        if (loggedUser.length === 0) {
          this.toastService.TriggerToast('Incorrect credentials!', false);
        } else {
          this.cancel();
          console.log('User logged:', loggedUser);
          this.router.navigate(['./games-list']);
        }
        /*  this.TriggerToast('Logged in with success!', true);  */
      },
      error: (error) => {
        /* this.loginForm.reset(); */
        console.error('Error logging in:', error);
        this.toastService.TriggerToast('Error login in!', false);
      },
    });
  }

}
