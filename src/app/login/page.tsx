'use client'
 
import { authenticate } from '@/app/lib/actions'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import { useFormState } from 'react-dom'

const SubmitButton = dynamic(() => import("@/_components/submit-button").then(mod => mod.SubmitButton))
 
export default function Page() {
  const [state, dispatch] = useFormState(authenticate, undefined)
  
  if (state?.success) {
    if (state.admin) {
      redirect('/admin')
    } else {
      redirect('/')
    }
  }
  
  return (
    <div className='card w-96 items-center text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' id='loginCard'>
      <div className='card-body'>
        <h1 className='card-title'>Autorizācija</h1>
        <form action={dispatch} >
          <label className='input input-bordered flex mb-2' >
            <input type='password' placeholder='Balsošanas kods' name='code' required />
          </label>
          {state?.success === false && 
            <div role='alert' className='alert alert-error mb-2'>
              <span className='material-symbols-outlined'>error</span>
              <span>{state.message}</span>
            </div>
          }
          <SubmitButton text='Autorizēties'/>
        </form>
        </div>
    </div>
  )
}