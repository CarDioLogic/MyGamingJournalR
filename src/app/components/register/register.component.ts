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
  GamingList: UserGamingList = {
    id: '',
    userId: '',
    games: [],
  };
  user: any = '';

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private toastController: ToastController,
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
      avatar: [''],
    });
  }
  createUser() {
    if (this.registrationForm.valid) {
      const user = this.registrationForm.value;

      this.usersService.createUser(user).subscribe({
        next: (createdUser) => {
          console.log('User created:', createdUser);
          this.cancel();
          this.router.navigate(['./games-list']);

          //this is needed to correctly create the gamingLists
          this.GamingList.id = undefined;
          this.GamingList.userId = createdUser.id;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.TriggerToast('Error creating user!', false);
        },
        complete: () => {
          this.CreateGamingListsForUser();
        },
      });
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

  CreateGamingListsForUser() {
    console.log(this.GamingList);

    this.createGamingList('usersListPlayLater');
    this.createGamingList('usersListCurrentlyPlaying');
    this.createGamingList('usersListPlayed');
    this.createGamingList('usersListCompleted');

  }

  createGamingList(listName:string){
    this.gamesListService
      .postGameToList(this.GamingList, listName)
      .subscribe(
        (response) => {
          console.log('Game list successfully added:', response);
        },
        (error) => {
        }
      );
  }
}
