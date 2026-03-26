import { ObjectId } from 'mongodb';

export const USERS_COLLECTION = 'users';

export interface UserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
}

export function toNewUserDoc(input: CreateUserInput): UserDoc {
  return {
    _id: new ObjectId(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date(),
  };
}
