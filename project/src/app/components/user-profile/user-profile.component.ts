import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  currentUser: User;

  constructor(
    public authService: AuthService,
  ) {
    let id = this.authService.getUserId();
    this.authService.getUser(id).subscribe(res => {
      this.currentUser = res.user;
      console.log(this.currentUser);
    });
  }

  ngOnInit() { }
}