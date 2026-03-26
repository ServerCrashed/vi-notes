import { ObjectId } from 'mongodb';

export const SESSIONS_COLLECTION = 'sessions';

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

export function toNewSessionDoc(userId: string): SessionDoc {
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

export function toPasteEvent(input: {
  t: number;
  pastedCharCount: number;
  pastedLineCount?: number;
}): PasteEvent {
  const event: PasteEvent = {
    t: input.t,
    pastedCharCount: input.pastedCharCount,
  };

  if (typeof input.pastedLineCount === 'number') {
    event.pastedLineCount = input.pastedLineCount;
  }

  return event;
}
