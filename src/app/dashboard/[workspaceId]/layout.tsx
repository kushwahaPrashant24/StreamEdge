import React from 'react'
import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import { verify } from 'crypto'
import { verifyAccessToWorkspace } from '@/actions/workspace'
import { QueryClient } from '@tanstack/react-query'
import { get } from 'http'
import { getWorkspaceFolders , getAllUserVideos , getWorkspaces , getNotifications } from "../../../actions/workspace"



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
    await query.prefetchQuery({
        queryKey: ['workspace-folders'],
        queryFn: () => getWorkspaceFolders(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-videos'],
        queryFn: () => getAllUserVideos(workspaceId),
    })

    await query.prefetchQuery({
        queryKey: ['user-workspaces'],
        queryFn: () => getWorkspaces(),
    })

    await query.prefetchQuery({
        queryKey: ['user-notifications'],
        queryFn: () => getNotifications(),
    })
    

  return <div>Layout</div>
  
}

export default Layout