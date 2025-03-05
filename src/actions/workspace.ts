"use server";
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 403 };

        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        user: {
                            clerkId: user.id, // Fix: `user` instead of `User`
                        },
                    },
                    {
                        members: {
                            some: {
                                user: {  // Fix: `user` instead of `User`
                                    clerkId: user.id,
                                },
                            },
                        },
                    },
                ],
            },
        });

        return isUserInWorkspace ? { status: 200 } : { status: 403 };
    } catch (error) {
        console.error("Error verifying workspace access:", error);
        return { status: 500 };
    }
};
