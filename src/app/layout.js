// app/layout.js

'use client';  // This marks the component as a Client Component

import { SessionProvider } from "next-auth/react";
import styles from "./page.module.css";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}