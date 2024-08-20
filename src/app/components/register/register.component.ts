import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonRow,
  IonImg,
  IonLabel,
  IonModal,
  IonItem,
  IonInput,
  IonToast,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UserGamingList } from 'src/app/models/userGamingList';
import { GamesListService } from 'src/app/services/games-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    IonToast,
    ReactiveFormsModule,
    IonInput,
    IonItem,
    IonModal,
    IonLabel,
    IonImg,
    IonRow,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  imageUrl: string = '../../../assets/icon/profileIcon.png'; //set a value for a default image that should in assets!!!!
  user: any = '';

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private toastService: ToastService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private gamesListService: GamesListService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.intializeRegistrationForm();
    this.user = this.authService.getLoggedInUser();
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  intializeRegistrationForm() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      avatar: [''],
    });
  }

  createUser() {
    const user = this.registrationForm.value;

    if (
      this.registrationForm.valid &&
      user.password === user.passwordConfirmation
    ) {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('password', user.password);
      formData.append('password_confirmation', user.passwordConfirmation);
      // If the avatar is a base64 string, convert it to a Blob
      if (user.avatar) {
        const blob = this.dataURLToBlob(user.avatar);
        formData.append('profile_image', blob, 'profile_image.jpg');
      }

      this.authService.createUser(formData).subscribe({
        next: (createdUser) => {
          console.log('User created:', createdUser);
          this.cancel();
          this.router.navigate(['./games-list']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.toastService.TriggerToast('Error creating user!', false);
        },
        complete: () => {},
      });
    } else {
      this.toastService.TriggerToast('Passwords must match!', false);
    }
  }

  dataURLToBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  openCamera() {
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        height: 512,
        width: 512,
      });
      this.imageUrl = image.base64String ?? '';
      this.imageUrl = 'data:image/jpeg;base64,' + this.imageUrl;
      this.registrationForm.controls['avatar'].setValue(this.imageUrl);
    };
    takePicture();
  }
}
