import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../../auth.service';
import { ProfileService } from '../../profile.service';
import { FriendService } from '../../friend.service';
import { User } from '../../user';
import { Profile } from '../../profile';
import { Friends } from '../../friend';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-friend',
  templateUrl: './user-friend.component.html',
  styleUrls: ['./user-friend.component.css']
})
export class UserFriendComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  default: [];
  newFriends: [];
  postNewFriend: [];
  websiteList: [];
  id: String;
  NewFriends: FormGroup;

  constructor(public router: Router,
    public friendService: FriendService,
    private formBuilder: FormBuilder,
    public authService: AuthService)
  {
    this.NewFriends = this.formBuilder.group({ email: ['']});
    this.id = this.authService.getUserId();
    this.friendService.getAllUser().subscribe(res => {
      console.log(res)
      this.websiteList = res;
      this.friendService.getFriendList(this.id).subscribe(res => {
        console.log(res);
        this.default = res.friends.friends;
        this.form = this.formBuilder.group({
          website: this.formBuilder.array([])
        }) 
      });
      this.friendService.getNewFriendList(this.id).subscribe(res => {
        this.newFriends = res.friends.newfriends;
      })
    });
    
  }

  onCheckboxChange(e) {
    const website: FormArray = this.form.get('website') as FormArray;

    if (e.target.checked) {
      website.push(new FormControl({_id: e.target.value, name: e.target.name}));
    } else {
      const index = website.controls.findIndex(x => x.value === e.target.value);
      website.removeAt(index);
    }
  }

  submit() {
    console.log(this.form.value);
    this.friendService.delFriendList(this.id);
    this.friendService.editFriendList(this.form.value, this.id);
    window.location.reload();
  }

  validNewFriends() {
    console.log(this.NewFriends.value.email);
    var a = [];
    a.push(this.NewFriends.value.email)
    this.newFriends.forEach(element => {
      if (element != null)
        a.push(element);
    });
    console.log(a);
    this.friendService.delNewFriendList(this.id);
    this.friendService.editNewFriendList(a, this.id);
    window.location.reload();
  }

  updateNewFriend() {
    const website: Friends = {_id: this.id, friends: []};
    this.newFriends.forEach(element => {
      this.friendService.getUser(element).subscribe(res => {
        if (res[0]) {
          website.friends.push({ _id: res[0]._id, name: res[0].name });
        }
      });
    });
    this.default.forEach(element => {
      website.friends.push(element);
    });
    console.log(website);
    this.friendService.delFriendList(this.id);
    this.friendService.editFriendListNew(website, this.id);
  }

  return() {
    this.router.navigate(['profile']);
  }

  ngOnInit(): void {
  }

}
