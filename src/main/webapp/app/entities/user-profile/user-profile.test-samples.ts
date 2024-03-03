import { Gender } from 'app/entities/enumerations/gender.model';

import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
  username: 'Account 3rd',
  email: 'Agustin.Lueilwitz93@yahoo.com',
  password: 'vortals',
};

export const sampleWithPartialData: IUserProfile = {
  id: 3089,
  username: 'Account',
  email: 'Kaleb.Simonis@gmail.com',
  password: 'motivating',
};

export const sampleWithFullData: IUserProfile = {
  id: 89292,
  username: 'Switzerland payment',
  email: 'Sarai80@hotmail.com',
  password: 'Ball Virgin District',
  name: 'transmit Card',
  age: 4625,
  gender: Gender['MALE'],
};

export const sampleWithNewData: NewUserProfile = {
  username: 'Dollar Technician',
  email: 'Ryan_Satterfield@yahoo.com',
  password: 'indigo integrate Small',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
