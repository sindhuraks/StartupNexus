"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import styles from "./page.module.css";
import SignupForm from "./auth/signup_form";

export default function Home() {
  const { data: session } = useSession();
  const [needsSignup, setNeedsSignup] = useState(false);

  useEffect(() => {
    if (session) {
      const checkUserProfile = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/user/check?email=${session.user.email}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setNeedsSignup(!data.exists); // If user doesn't exist, they need to sign up
        } catch (error) {
          console.error("Error checking user profile:", error);
        }
      };

      checkUserProfile();
    }
  }, [session]);

  return (
    <div>
      <div className={styles.horizontalbar}>
        <h1 className={styles.logoText}>StartupNexus</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h1>
            <Typewriter
              options={{
                strings: [
                  "Where Ideas Meet Opportunity...",
                  "Connect. Collaborate. Succeed.",
                  "Turn Your Vision into Reality!",
                ],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
          </h1>
        </div>

        <div className={styles.rightSection}>
          {session ? (
            needsSignup ? (
              <>
                <h1 className={styles.rightText}>Let's Set Your Profile!</h1>
                <SignupForm /> {/* Render Signup Form for new users */}
              </>
            ) : (
              <>
                <h1 className={styles.rightText}>Welcome back, {session.user.name}</h1>
                <button className={styles.loginButton} onClick={signOut}>
                  Sign Out
                </button>
              </>
            )
          ) : (
            <>
              <h1 className={styles.rightText}>Welcome Back!</h1>
              <h3 className={styles.rightText}>Sign in to your account</h3>
              <br />
              <button className={styles.loginButton} onClick={() => signIn("github", { prompt: "login", callbackUrl: "/" })}>
                <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                Continue with GitHub
              </button>
              <br />
              <button className={styles.loginButton} onClick={() => signIn("google", { prompt: "login", callbackUrl: "/" })}>
                <svg viewBox="-0.5 0 48 48" width="18" height="18" fill="none">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-401.000000, -860.000000)">
                      <g transform="translate(401.000000, 860.000000)">
                        <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05" />
                        <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335" />
                        <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853" />
                        <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4" />
                      </g>
                    </g>
                  </g>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}