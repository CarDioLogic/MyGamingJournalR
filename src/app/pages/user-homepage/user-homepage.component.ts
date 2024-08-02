import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: true,
  imports: [IonActionSheet, 
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
    this.usersService.deleteUser(this.userId).subscribe({
      next: (result:any) => {
        localStorage.removeItem('user');
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
      avatar: ['']
    });
  }

  updateUser() {
    if (this.registrationForm.valid) {
      const user = this.registrationForm.value;
      user.id = this.userId;
      this.usersService.editUser(this.userId, user).subscribe({
        next: (userUpdated) => {
          console.log('User updated:', userUpdated);
          this.cancel();
          this.router.navigate(['./games-list']);
          window.location.reload(); 
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.TriggerToast('Error updating user!', false);
        }
      });
    }
  }

  getUser() {
    return this.usersService.getUsersById(this.userId).subscribe({
      next: (user) => {
        console.log('User:', user);
        this.user = user;
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
        avatar: this.user.avatar || this.imageUrl
      });
      this.imageUrl = this.user.avatar || this.imageUrl;
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
}
