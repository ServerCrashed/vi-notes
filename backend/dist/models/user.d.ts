import { ObjectId } from 'mongodb';
export declare const USERS_COLLECTION = "users";
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
export declare function toNewUserDoc(input: CreateUserInput): UserDoc;
//# sourceMappingURL=user.d.ts.map