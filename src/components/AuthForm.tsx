'use client'
import { useRouter } from 'next/navigation'
import React, { startTransition, useTransition } from 'react'
import { CardContent, CardFooter } from './ui/card';
import { Loader2, Underline } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { text } from 'stream/consumers';
import { toast } from 'sonner';
import { loginAction, signUpAction } from '@/actions/users';
type Props={
    type: "login" | "signUp";
};
function AuthForm({type}:Props) {
  const isLoginForm= type ==="login";
  const router= useRouter();
  const [isPending, setPending] = useTransition();
  
  const handleSubmit= (formData: FormData) => {
    
    startTransition(async ()=>{ 
      const email=formData.get("email") as string;
      const password=formData.get("password")as string;
      let errorMessage;
      let title
      let description;

      if(isLoginForm){
        errorMessage=(await loginAction(email, password)).errorMessage
        title="Logged In";
        description= "You are logged in successfully";
      }else{
        errorMessage=(await signUpAction(email, password)).errorMessage
        title="Signed Up";
        description= "Check your email for confirmation";
      }
      if (!errorMessage) {
        toast.success(description, {
          description: title,
        });
        
      } else {
        toast.error(errorMessage, {
          description: "Error",
        });
      }
      router.push("/");


    });
  };

   
  return (
    <form action={handleSubmit}>
      <CardContent className='grid w-full items-center gap-4'>
        <div className='flex flex-col space-y-1.5'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            placeholder='Enter email'
          type='email'
          required
          disabled={isPending}/>
          </div>
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor='password'>password</label>
            <input
            id='password'
            name='password'
            placeholder='Enter password'
            type='password'
            required
            disabled={isPending}/>    
              </div>
              </CardContent>
              <CardFooter className='mt-4 flex flex-col gap-6'>
                <Button className='w-full'>
                  {isPending?(
                    <Loader2 className='animation-spin' />
                  ):isLoginForm? 'Login': 'Sign Up'}
                </Button>
                <p className='text-xs'>
                  {isLoginForm? 'Don\'t have an account?': 'Already have an account?'}
                  {' '}
                  <Link href={isLoginForm? '/sign-up':'/login'}
                  className={`text-blue-500 underline ${isPending? "pointer-events-none opacity-50" : ""}`}>
                    {isLoginForm? 'Sign Up': 'Login'}
                  </Link>         
                </p>
              </CardFooter>
</form>
  )
}

export default AuthForm