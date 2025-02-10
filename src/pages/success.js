// pages/success.js
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to home page if logged out
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      {session ? (
        <>
          <h1>Welcome, {session.user.name}!</h1>
          <button
            onClick={() =>
              signOut({ redirect: false }).then(() => {
                router.push("/"); // Ensure proper logout redirection
              })
            }
          >
            Sign Out
          </button>
        </>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}