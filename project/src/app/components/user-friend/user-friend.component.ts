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
  default: [];
  websiteList: any = [
    { id: 1, name: 'ItSolutionStuff.com' },
    { id: 2, name: 'HDTuto.com' },
    { id: 3, name: 'NiceSnippets.com' }
  ];
  id: String;

  constructor(public router: Router,
    public friendService: FriendService,
    private formBuilder: FormBuilder,
    public authService: AuthService)
  {
    this.id = this.authService.getUserId();
    this.friendService.getAllUser().subscribe(res => {
      console.log(res)
      this.websiteList = res;
      this.friendService.getFriendList(this.id).subscribe(res => {
        console.log(res);
        this.default = res.friends.friends;
        this.form = this.formBuilder.group({
          website: this.formBuilder.array([], [Validators.required])
        }) 
      });
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
  }

  return() {
    this.router.navigate(['profile']);
  }

  ngOnInit(): void {
  }

}
