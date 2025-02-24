import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoutes = createRouteMatcher([
  '/dashboard(.*)', 
  '/api/payment', 
  '/payment(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoutes(req)) {
    const { userId, redirectToSignIn } = await auth(); // Await auth()

    if (!userId) {
      return redirectToSignIn(); // Redirects unauthorized users
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
