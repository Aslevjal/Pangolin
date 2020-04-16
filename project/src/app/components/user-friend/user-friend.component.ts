import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-friend',
  templateUrl: './user-friend.component.html',
  styleUrls: ['./user-friend.component.css']
})
export class UserFriendComponent implements OnInit {

  constructor(public router: Router) { }

  return() {
    this.router.navigate(['profile']);
  }

  ngOnInit(): void {
  }

}
