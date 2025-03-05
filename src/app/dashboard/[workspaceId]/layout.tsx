import React from 'react'
import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import { verify } from 'crypto'
import { verifyAccessToWorkspace } from '@/actions/workspace'

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

  return <div>Layout</div>
  
}

export default Layout