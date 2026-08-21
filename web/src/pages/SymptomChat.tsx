import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Send } from 'lucide-react'
import { Button, ButtonLink } from '../components/ui'
import { useVita } from '../context'

export function SymptomChat() {
  const navigate = useNavigate()
  const { messages, sendChat, requestClinicalReview } = useVita()
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [lastPrompt, setLastPrompt] = useState('')

  async function submit(event?: FormEvent) {
    event?.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setSending(true)
    setError('')
    setLastPrompt(text)
    setDraft('')
    const result = await sendChat(text)
    setSending(false)
    if (result === 'emergency') navigate('/app/chat/emergency')
    if (result === 'error') setError('Vita could not reach the AI service. Your clinic can still review this conversation.')
  }

  async function retry() {
    if (!lastPrompt || sending) return
    setSending(true)
    setError('')
    const result = await sendChat(lastPrompt)
    setSending(false)
    if (result === 'error') setError('The retry did not connect. Try again in a moment.')
  }

  function useVoice() {
    setListening(true)
    window.setTimeout(() => {
      setDraft('I have had a headache since this morning')
      setListening(false)
    }, 700)
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <h1 className="font-display text-3xl font-bold">Symptom guidance</h1>
      <p className="text-sm font-medium text-white/90">
        AI guidance between visits. For severe symptoms, use Emergency.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested questions">
        {['I missed a dose', 'Explain my lab result', 'I feel dizzy'].map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="rounded-full bg-white/12 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
            onClick={() => setDraft(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <ol className="mt-4 flex flex-1 flex-col gap-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm tracking-normal ${
              message.from === 'user'
                ? 'ml-auto bg-white text-navy'
                : 'bg-white/12 text-white ring-1 ring-white/20'
            }`}
          >
            {message.from === 'vita' ? (
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="kicker text-[11px] text-white/90">AI-generated</p>
                {message.createdAt ? <time className="text-[11px] text-white/60">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time> : null}
              </div>
            ) : null}
            {message.text}
          </li>
        ))}
      </ol>
      {sending ? <p className="mt-3 text-sm font-medium text-white/80" role="status">Vita is reviewing your message…</p> : null}
      {error ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-burgundy/20 px-3 py-2 text-sm text-white ring-1 ring-burgundy/40" role="alert">
          <span>{error}</span>
          <Button type="button" variant="secondary" className="shrink-0 px-3 text-xs" onClick={retry}>Retry</Button>
        </div>
      ) : null}
      <div className="mt-4 flex gap-2">
        <ButtonLink to="/app/chat/emergency" variant="danger" className="flex-1">
          Emergency
        </ButtonLink>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            requestClinicalReview(
              'Patient requested clinical review from symptom guidance.',
            )
            setReviewSent(true)
          }}
        >
          Contact clinic
        </Button>
      </div>
      {reviewSent ? (
        <p className="mt-2 text-sm font-medium text-white" role="status">
          Review requested. On the clinic queue.
        </p>
      ) : null}
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <label htmlFor="chat" className="sr-only">
          Message
        </label>
        <input
          id="chat"
          className="min-h-11 flex-1 rounded-xl border border-white/20 bg-white px-3 text-[16px] tracking-normal text-black"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={listening ? 'Listening…' : 'Describe how you feel'}
        />
        <Button
          type="button"
          variant="secondary"
          aria-label="Voice input"
          onClick={useVoice}
        >
          <Mic className="size-4" />
        </Button>
        <Button type="submit" aria-label="Send" disabled={sending}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
