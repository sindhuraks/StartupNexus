import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <div className={styles.horizontalbar}>
        <h1 className={styles.logoText}>StartupNexus</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h2>New here ?</h2>
          <p>Then Sign Up and Start Connecting!</p>
        </div>

        <div className={styles.rightSection}>
          <h1>Sign in</h1>
        </div>
      </div>
    </div>
  );
}
