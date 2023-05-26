import { StytchUIClient } from "https://www.unpkg.com/@stytch/vanilla-js@0.9.5/dist/index.esm.js";


// const STYTCH_PUBLIC_TOKEN = process.env.STYTCH_PUBLIC_TOKEN
const STYTCH_PUBLIC_TOKEN = "public-token-live-ba72f491-8dbb-4957-ad2d-51594bbf6b4b"
console.log("project-test-943986c5-33a7-4131-9011-eee73f1cd631")


// Export stytch so that the other scripts in this application can interact with it.
export const stytch = new StytchUIClient(STYTCH_PUBLIC_TOKEN);

/*
Session logic

The logic below listens to the existence of a Stytch Session to:
- redirect newly authenticated traffic to /profile.
- redirect unauthenticated traffic to /profile.
- redirect the user back to login if they log out.

*/
const ROUTES = {
  LOGIN: "/",
  AUTHENTICATE: "/authenticate",
  PROFILE: "/profile",
};

const PROTECTED_ROUTES = [ROUTES.PROFILE];
const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.AUTHENTICATE];

// On page load, we check for the existence of a cached session.
let cachedSession = stytch.session.getSync();
// If there is no session, and we are on a protected route then redirect the user to Login.
if (!cachedSession && PROTECTED_ROUTES.includes(window.location.pathname)) {
  window.location.href = ROUTES.LOGIN;
}

const unsubscribe = stytch.session.onChange((session) => {
  if (session) {
    if (PUBLIC_ROUTES.includes(window.location.pathname)) {
      window.location.href = ROUTES.PROFILE;
    }
  } else {
    if (PROTECTED_ROUTES.includes(window.location.pathname)) {
      window.location.href = ROUTES.LOGIN;
    }
  }
});

// On page close unsubscribe the onChange listener.
window.addEventListener("beforeunload", () => {
  unsubscribe && unsubscribe();
});
