import { ObjectId } from 'mongodb';
export declare const SESSIONS_COLLECTION = "sessions";
export interface PasteEvent {
    t: number;
    pastedCharCount: number;
    pastedLineCount?: number;
}
export interface SessionDoc {
    _id: ObjectId;
    userId: ObjectId;
    startedAt: Date;
    endedAt?: Date;
    pasteEvents: PasteEvent[];
    pasteStats: {
        pasteCount: number;
        totalPastedChars: number;
    };
    docStats?: {
        finalCharCount?: number;
        finalWordCount?: number;
    };
}
export declare function toNewSessionDoc(userId: string): SessionDoc;
export declare function toPasteEvent(input: {
    t: number;
    pastedCharCount: number;
    pastedLineCount?: number;
}): PasteEvent;
//# sourceMappingURL=session.d.ts.map