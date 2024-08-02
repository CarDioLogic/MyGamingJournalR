import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // Adjust the path as needed
import { IonModal } from '@ionic/angular';
import { Route, Router, ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal; // Use definite assignment assertion

  user: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private router:Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
  }

  openSettings() {
    this.navCtrl.navigateForward('/settings');
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  logout() {
    this.router.navigate(['./home']);
    localStorage.removeItem('user');
    this.modal.dismiss(null, 'cancel');
  }
  navigateToUserProfile(){
    this.router.navigate(['./profile/', this.user.id]);
    this.modal.dismiss(null, 'cancel');
  }
}
