import { createThirdwebClient } from "thirdweb";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "848b03e7ab7e354845dbd6ab6782b5e2";
const secretKey = import.meta.env.VITE_THIRDWEB_SECRET_KEY;

let client = null;

if (!clientId && !secretKey) {
    // Avoid calling createThirdwebClient without credentials — that throws at runtime.
    // Keep `client` as null so callers can choose to omit passing a client to components.
    // eslint-disable-next-line no-console
    console.warn(
        "Thirdweb client not configured: set VITE_THIRDWEB_CLIENT_ID or VITE_THIRDWEB_SECRET_KEY",
    );
} else {
    client = createThirdwebClient({ clientId, secretKey });
}

export { client };

