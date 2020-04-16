import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ProfileService } from '../../profile.service';
import { User } from '../../user';
import { Profile } from '../../profile';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  currentUser: User;
  currentProfile: Profile;
  isEdit = false;
  editForm: FormGroup;
  id: String;

  constructor(
    public authService: AuthService,
    public profileService: ProfileService,
    public formBuilder: FormBuilder,
  ) {
    this.id = this.authService.getUserId();
    this.authService.getUser(this.id).subscribe(res => {
      this.currentUser = res.user;
      this.profileService.createProfile(this.currentUser);
      this.profileService.getProfile(this.id).subscribe(res => {
        this.currentProfile = res.profile;
        this.editForm = this.formBuilder.group({
          age: this.currentProfile.age,
          familly: this.currentProfile.familly,
          race: this.currentProfile.race,
          food: this.currentProfile.food,
        })
      });
    });
  }

  runEdit() {
    this.isEdit = true;
  }

  endEdit() {
    this.profileService.editProfile(this.editForm.value, this.id);
    this.isEdit = false;
  }

  ngOnInit() { }
}