import { Component } from '@angular/core';
import { AccountModel } from '../core/models/account-model';
import { AuthService } from '../core/services/auth.service';
import { UserGender } from '../core/models/user-model';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';
import { AccountService } from '../core/services/account.service';

import * as moment from 'moment-timezone';
import { UserPictureService } from '../core/services/user-picture.service';

@Component({
  moduleId: module.id,
  selector: 'bs-new-user',
  templateUrl: 'new-account.component.html'
})
export class NewAccountComponent {
  private _genders: string[] = Object.values(UserGender);
  private _timezones: string[] = moment.tz.names();
  private _user: AccountModel;
  private _avatar: any;

  public get genders(): string[] {
    return this._genders;
  }

  public get timezones(): string[] {
    return this._timezones;
  }

  public get user(): AccountModel {
    return this._user;
  }

  public get avatar(): any {
    return this._avatar;
  }

  constructor(private _authService: AuthService,
              private _accountService: AccountService,
              private _notificationService: NotificationService,
              private _router: Router,
              private _userPictureService: UserPictureService) {
    this._user = this._authService.user;
    this._setTimeZone();
    this._getUserPicture();
  }

  public logout() {
    this._authService.logout();
  }

  public update() {
    this._accountService.save(this._user).subscribe(
      (user) => {
        this._authService.user = user;
        this._router.navigate(['/profile']);
        this._notificationService.success('T_SUCCESS_NEW_USER_SAVED');
      },
      error => this._notificationService.error('T_ERROR_SAVED')
    );
  }

  public getOffset(tzId: string) {
    return moment.tz(tzId).format('Z');
  }

  public savePicture(image: any) {
    this._accountService.setPicture(image).subscribe(picture => {
      this._getUserPicture();
    }, error => this._notificationService.error(error));
  }

  protected _setTimeZone() {
    if (this._user && (this._user.timezone === 'GMT' || this._user.timezone === 'Z' || !this._user.timezone)) {
      this._user.timezone = moment.tz.guess();
    }
  }

  protected _getUserPicture() {
    this._userPictureService.getPicture(this._user.id).subscribe(picture => this._avatar = picture);
  }
}
