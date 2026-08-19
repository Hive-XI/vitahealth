import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Send } from 'lucide-react'
import { Button, ButtonLink } from '../components/ui'
import { useVita } from '../context'

export function SymptomChat() {
  const navigate = useNavigate()
  const { messages, sendChat } = useVita()
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const text = draft.trim()
    if (!text) return
    const result = sendChat(text)
    setDraft('')
    if (result === 'emergency') navigate('/app/chat/emergency')
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
      <h1 className="font-display text-3xl font-bold">Symptom chat</h1>
      <p className="text-sm text-white/75">
        Free text or voice. Possible causes are not a diagnosis.
      </p>
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
            {message.text}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex gap-2">
        <ButtonLink to="/app/chat/emergency" variant="danger" className="flex-1">
          Emergency
        </ButtonLink>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => setReviewSent(true)}
        >
          Request clinical review
        </Button>
      </div>
      {reviewSent ? (
        <p className="mt-2 text-sm font-medium text-navy" role="status">
          Review requested. Your clinic will see this in the escalation queue.
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
        <Button type="submit" aria-label="Send">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
