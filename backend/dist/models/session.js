import { ObjectId } from 'mongodb';
export const SESSIONS_COLLECTION = 'sessions';
export function toNewSessionDoc(userId) {
    return {
        _id: new ObjectId(),
        userId: new ObjectId(userId),
        startedAt: new Date(),
        pasteEvents: [],
        pasteStats: {
            pasteCount: 0,
            totalPastedChars: 0,
        },
    };
}
export function toPasteEvent(input) {
    const event = {
        t: input.t,
        pastedCharCount: input.pastedCharCount,
    };
    if (typeof input.pastedLineCount === 'number') {
        event.pastedLineCount = input.pastedLineCount;
    }
    return event;
}
//# sourceMappingURL=session.js.map