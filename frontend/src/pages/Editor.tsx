import { useMemo, useState } from 'react';
import { endSession, recordPaste, startSession } from '../api/client';

type EditorPageProps = {
  token: string;
  onLogout: () => void;
};

export default function EditorPage({ token, onLogout }: EditorPageProps) {
  const [text, setText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pasteCount, setPasteCount] = useState(0);
  const [totalPastedChars, setTotalPastedChars] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canEndSession = useMemo(() => Boolean(sessionId) && !loading, [sessionId, loading]);

  const handleStartSession = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await startSession(token);
      setSessionId(response.sessionId);
      setPasteCount(0);
      setTotalPastedChars(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const trimmed = text.trim();
      const finalWordCount = trimmed ? trimmed.split(/\s+/).length : 0;

      await endSession(sessionId, token, {
        endedAt: Date.now(),
        finalCharCount: text.length,
        finalWordCount,
      });

      setSessionId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData('text');
    const pastedCharCount = pastedText.length;
    const pastedLineCount = pastedText ? pastedText.split(/\r\n|\r|\n/).length : 0;

    setPasteCount((current) => current + 1);
    setTotalPastedChars((current) => current + pastedCharCount);

    if (!sessionId) {
      return;
    }

    try {
      await recordPaste(sessionId, token, {
        t: Date.now(),
        pastedCharCount,
        pastedLineCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record paste event');
    }
  };

  return (
    <main style={{ maxWidth: 840, margin: '2rem auto', padding: '1rem' }}>
      <h1>Editor</h1>

      <div className="editor-toolbar">
        <button className="btn btn-primary" onClick={handleStartSession} disabled={Boolean(sessionId) || loading}>
          Start Session
        </button>
        <button className="btn btn-danger" onClick={handleEndSession} disabled={!canEndSession}>
          End Session
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            localStorage.removeItem('vi_notes_token');
            onLogout();
          }}
        >
          Logout
        </button>
      </div>

      <p>
        Active Session: {sessionId ?? 'None'}
        <br />
        Paste Count: {pasteCount}
        <br />
        Total Pasted Chars: {totalPastedChars}
      </p>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onPaste={handlePaste}
        placeholder="Start writing..."
        style={{ width: '100%', minHeight: 360, resize: 'vertical' }}
      />
    </main>
  );
}
