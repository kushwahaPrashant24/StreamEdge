"use server";
import { client } from "../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        console.log(user);

        if (!user) {
            return { status: 403, message: "User not authenticated" };
        }

        // Check if the user already exists
        const userExist = await client.user.findUnique({
            where: {
                clerkId: user.id, // Ensure this field name matches your schema
            },
            include: {
                workspaces: true, // Include all workspaces
                subscription: true, // Include subscription details
            },
        });

        if (userExist) {
            return { status: 200, user: userExist };
        }

        // Create a new user if they don't exist
        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
                studio: {
                    create: {}, // Create an associated studio
                },
                subscription: {
                    create: {}, // Create an associated subscription
                },
                workspaces: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: "PERSONAL",
                    },
                },
            },
            include: {
                workspaces: true, // Include the created workspace
                subscription: true, // Include the created subscription
            },
        });

        if (newUser) {
            return { status: 201, user: newUser };
        }

        return { status: 400, message: "Failed to create user" };
    } catch (error) {
        console.error("Error in onAuthenticateUser:", error); // Log the error for debugging
        return { status: 500, message: "Internal server error" };
    }
};