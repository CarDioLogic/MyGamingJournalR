import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ModalController,
  ToastController,
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
  IonToast, IonActionSheet } from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { UserGamingList } from 'src/app/models/userGamingList';
import { GamesListService } from 'src/app/services/games-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UserMenuComponent } from 'src/app/components/user-menu/user-menu.component';
@Component({
  standalone: true,
  imports: [IonActionSheet, UserMenuComponent, CommonModule,
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
  providers: [],
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.scss'],
})
export class UserHomepageComponent implements OnInit {
  myGamingJournalApiUrl = environment.MyGamingJournalApiUrl;
  registrationForm!: FormGroup;
  imageUrl: string = '../../../assets/icon/profileIcon.png'; // Default image
  user: any = '';
  userId: string = '';

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private toastController: ToastController,
    private usersService: UsersService,
    private fb: FormBuilder,
    private gamesListService: GamesListService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') as string;
    this.intializeRegistrationForm();
    await this.getUser();
    this.populateFormWithUserData();
  }
  isAuth() {
    return this.authService.isAuthenticated();
  }
  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  confirmDelete(ev: any) {
    if (ev.detail.role === 'destructive') {
      this.deleteUser();
    }
  }

  deleteUser(){
    this.authService.deleteUser(this.userId).subscribe({
      next: (result:any) => {
        sessionStorage.removeItem('user');
        this.router.navigate(['./home']);
        this.TriggerToast('User deleted!', true);

      }
    })
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  intializeRegistrationForm() {
    this.registrationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      avatar: ['']
    });
  }

  updateUser() {
    const user = this.registrationForm.value;

    if (this.registrationForm.valid &&
      user.password === user.passwordConfirmation
    ) {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('password', user.password);
      formData.append('password_confirmation', user.passwordConfirmation);

      console.log("dadaa",user);

      // If the avatar is a base64 string, convert it to a Blob
      if (user.avatar && this.isImageChanged(user.avatar)
      ) {
        const blob = this.dataURLToBlob(user.avatar);
        formData.append('profile_image', blob, 'profile_image.jpg');
      }
      console.log('User updated:', formData);

      this.authService.updateUser(user.id, formData).subscribe({
        next: (updatedUser) => {
          console.log('User updated:', formData);
          this.cancel();
          this.router.navigate(['./games-list']);
          window.location.reload(); 

        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.TriggerToast('Error updating user!', false);
        },
        complete: () => {
        },
      });

    } else {
      this.TriggerToast('Passwords must match!', false)
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

  getUser() {
    return this.authService.getUser(this.userId).subscribe({
      next: (response) => {

        this.user = response.data.user;
        console.log('User:', this.user);
        this.populateFormWithUserData();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.TriggerToast('Error fetching user data!', false);
      }
    });
  }

  populateFormWithUserData() {
    if (this.user) {
      this.registrationForm.patchValue({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
/*         password: this.user.password,
        password_confirmation: this.user.password, */
        avatar: (this.myGamingJournalApiUrl + this.user.profile_image) || this.imageUrl
      });
      this.imageUrl = this.myGamingJournalApiUrl + this.user.profile_image || this.imageUrl;
    }
  }

  async TriggerToast(toastMessage: string, isToastSuccess: boolean | null) {
    let toastCssClass = '';
    if (isToastSuccess === true) {
      toastCssClass = 'success-toast';
    } else if (isToastSuccess === false) {
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
          role: 'cancel',
        },
      ],
    });
    toast.present();
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

  isImageChanged(currentImage:string){
    const userJson = sessionStorage.getItem('user');

    if (userJson) {
      const userOnDb = JSON.parse(userJson);
      const profileImageOnDb = userOnDb.profile_image;
    
      return currentImage != profileImageOnDb ? true : false;
    }
    return false;
  }
}
