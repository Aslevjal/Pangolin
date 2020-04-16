import {User} from './user'

export class Profile {
    _id: String;
    age: String;
    familly: String;
    race: String;
    food: String;
    friend: [User];
}