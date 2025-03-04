import React from 'react'
import { onAuthenticateUser } from '@/actions/user'
import {redirect } from 'next/navigation'


const AuthCallback = async () => {

    //Authenticating the user
    const auth = await onAuthenticateUser()
    if (auth.status === 200 || auth.status === 201) {
      return redirect(`/dashboard/${auth.user?.firstname}${auth.user?.lastname}`)

    }

    // if account is not authenticated, redirect to sign-in page
    if (auth.status === 400 || auth.status === 500  ) {
      return redirect('/sign-in')
    }
   
}

export default AuthCallback;