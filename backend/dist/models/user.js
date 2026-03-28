import { ObjectId } from 'mongodb';
export const USERS_COLLECTION = 'users';
export function toNewUserDoc(input) {
    return {
        _id: new ObjectId(),
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        createdAt: new Date(),
    };
}
//# sourceMappingURL=user.js.map