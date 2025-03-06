import React from 'react'
import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import { verify } from 'crypto'
import { verifyAccessToWorkspace } from '@/actions/workspace'
import { QueryClient } from '@tanstack/react-query'



type Props = {
    params: {
        workspaceId: string
    }
    children: React.ReactNode
}

const Layout = async ({ params: { workspaceId }, children }: Props) => {
    const auth = await onAuthenticateUser()
    if (!auth.user?.workspaces) redirect('/auth/sign-in')
    if (!auth.user?.workspaces.length) redirect('/auth/sign-in')
    const hasAccess = await verifyAccessToWorkspace(workspaceId)

    if (hasAccess.status !== 200) {
        redirect('/dashboard/${auth.user?.workspaces[0].id}')
    }

    if (hasAccess.status !== 200 || !hasAccess.message) return null

    const query =  new QueryClient()
    

  return <div>Layout</div>
  
}

export default Layout