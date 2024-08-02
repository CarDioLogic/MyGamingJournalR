import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController, IonInput, IonHeader, IonButton, IonItem, IonLabel, IonContent, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, IonButtons, IonTitle, IonToolbar, IonContent, IonLabel, IonItem, IonButton, IonHeader, IonInput],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  loginForm!: FormGroup;

  constructor(private modalCtrl: ModalController,
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private toastController: ToastController,
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    console.log()
    this.intializeLoginForm();
  }
  intializeLoginForm(){
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(){
    const credentials = this.loginForm.value;
    this.authService.login(credentials.name, credentials.password).subscribe({
      next: loggedUser => {
        if(loggedUser.length === 0){
          this.TriggerToast('Incorrect credentials!', false);
        }
        else {
          this.cancel();
          console.log('User logged:', loggedUser);
          this.router.navigate(['./games-list']);
        }
       /*  this.TriggerToast('Logged in with success!', true);  */

      },
      error: error => {
        /* this.loginForm.reset(); */
        console.error('Error logging in:', error);
        this.TriggerToast('Error login in!', false);
      }
    });
  }

  async TriggerToast(toastMessage:string, isToastSuccess:boolean|null){
    let toastCssClass = '';
    if(isToastSuccess === true){
      toastCssClass = 'success-toast';
    } else if (isToastSuccess === false){
      toastCssClass = 'error-toast';
    } else {
      toastCssClass = 'neutral-toast';
    }

    const toast = await this.toastController.create({
      cssClass: toastCssClass,
      message: toastMessage,
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
    });
    toast.present();
  }
}
