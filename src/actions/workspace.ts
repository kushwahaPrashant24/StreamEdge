"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { validate as validateUUID } from "uuid";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
    try {
        // Validate workspaceId
        if (!validateUUID(workspaceId)) {
            console.error("Invalid workspaceId:", workspaceId);
            return { status: 400, message: "Invalid workspace ID" };
        }

        // Get current user
        const user = await currentUser();
        if (!user) return { status: 403, message: "Unauthorized" };

        // Log for debugging
        console.log("workspaceId:", workspaceId);
        console.log("user.id (Clerk ID):", user.id);

        // Check if user has access to the workspace
        const isUserInWorkspace = await client.workSpace.findFirst({
            where: {
                id: workspaceId,
                OR: [
                    {
                        userId: user.id, // User is the owner of the workspace
                    },
                    {
                        members: {
                            some: {
                                userId: user.id, // User is a member of the workspace
                            },
                        },
                    },
                ],
            },
        });

        return isUserInWorkspace ? { status: 200 } : { status: 403 };
    } catch (error) {
        console.error("Error verifying workspace access:", error);
        return { status: 500, message: "Internal server error" };
    }
};

export const getWorkspaceFolders = async (workspaceId: string) => {

    try {
        const isFolders = await client.folder.findMany({
            where: {
                workspaceId,
            },

            include: {
                _count: {
                    select: { videos: true }
                }
            }

        });
        if (isFolders && isFolders.length > 0) {
            return { status: 200, data: isFolders };
        }
        return { status: 404, data: [] };
    } catch (error) {
        return { status: 403, data: [] }
    }

}

export const getAllUserVideos = async (workSpaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, data: [] };
        const videos = await client.video.findMany({
            where: {
                OR: [{ workSpaceId }, { folderId: workSpaceId }]
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                folder: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                    }
                },

            },
        });
        if (videos && videos.length > 0) {
            return { status: 200, data: videos };
        }
        return { status: 404, data: [] };
    } catch (error) {
        return { status: 403, data: [] }
    }
}


export const getWorkspaces = async () => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, data: [] };

        const workspaces = await client.user.findMany({ // ✅ Fixed table name (workspace)
            where: {
                clerkId: user.id,
            }, 
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                },
                workspaces: { // ✅ Assuming this refers to something valid in your schema
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    }
                },
                members: {
                    select: {
                        workspace: { // ✅ Fixed naming (assumed correct)
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            }
                        }
                    }
                }
            }
        });

        if (workspaces && workspaces.length > 0) {
            return { status: 200, data: workspaces };
        }
        return { status: 404, data: [] };

    } catch (error) {
        return { status: 403, data: [] };
    }
};




export const getNotifications = async () => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404, data: [] };
        const notifications = await client.notification.findMany({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                content: true,
            },
        });
        if (notifications && notifications.length > 0) {
            return { status: 200, data: notifications };
        }
    }
    catch (error) {
        return { status: 403, data: [] }
    }
};
