import { useFormStatus } from "react-dom"

interface SubmitButtonProps {
    text: string
    error?: boolean
}

export function SubmitButton({text, error}: SubmitButtonProps) {
    const { pending } = useFormStatus()
   
    return (
      <button className={'btn' + (error ? ' btn-error' : '')} aria-disabled={pending} type="submit">
        {pending && <span className="loading loading-spinner"></span>}
        {text}
      </button>
    )
  }