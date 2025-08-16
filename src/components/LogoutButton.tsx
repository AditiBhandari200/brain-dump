"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logOutAction } from '@/actions/users';
function LogoutButton() {
    const router =useRouter();
    const [loading, setLoading] = useState(false);
  const handelLogOut = async () => {
    setLoading(true);
    
    const {errorMessage}= await logOutAction(); // Simulate the logOut action, replace with actual action when it's ready.
   
    if (!errorMessage) {
        toast.success("Logged out successfully!");
        router.push("/");
    } else {
        toast("Error", {
            description: errorMessage,
        });
    }
    setLoading(false);
  };
  return (
    <Button
    variant="outline" onClick={handelLogOut}
    disabled={loading}
    className='w-24'> 
        {loading ? <Loader2 className='animate-spin' /> : "Logout"}
    </Button>
  );
}

export default LogoutButton