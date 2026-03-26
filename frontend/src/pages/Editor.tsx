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
  const canResetPastedStats = useMemo(() => !sessionId && !loading, [sessionId, loading]);
  const charCount = useMemo(() => text.length, [text]);
  const wordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const paragraphCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return 0;
    }

    return trimmed.split(/\n\s*\n+/).length;
  }, [text]);

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
      const finalWordCount = wordCount;

      await endSession(sessionId, token, {
        endedAt: Date.now(),
        finalCharCount: charCount,
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
    <main className="editor-page">
      <header className="editor-header">
        <h1 className="editor-title">Vi-Notes</h1>

        <div className="editor-toolbar">
          <button className="btn btn-primary btn-sm" onClick={handleStartSession} disabled={Boolean(sessionId) || loading}>
            Start Session
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleEndSession} disabled={!canEndSession}>
            End Session
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setPasteCount(0);
              setTotalPastedChars(0);
            }}
            disabled={!canResetPastedStats}
            title={sessionId ? 'End session before resetting pasted stats' : 'Reset pasted stats'}
          >
            Reset Pasted Stats
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              localStorage.removeItem('vi_notes_token');
              onLogout();
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <section id="spacer"></section>

      <section className="editor-stats">
        <p>Active Session: {sessionId ?? 'None'}</p>
        <p>Paste Count: {pasteCount}</p>
        <p>Total Pasted Chars: {totalPastedChars}</p>
        <p>Characters: {charCount}</p>
        <p>Words: {wordCount}</p>
        <p>Paragraphs: {paragraphCount}</p>
      </section>

      {error && <p className="auth-error">{error}</p>}

      <textarea
        className="editor-textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onPaste={handlePaste}
        placeholder="Start writing..."
      />
    </main>
  );
}
