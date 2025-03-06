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