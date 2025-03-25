"use client";
import styles from "./dashboard.module.css";
import { useState } from "react";
import NewsFeed from "./newsfeed";

export default function Dashboard() {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isPostModalVisible, setPostModalVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const togglePostModal = () => {
        setPostModalVisible((prev) => !prev);
    };

    return (   
        <div>
            <div className={styles.horizontalbar}>
                <h1 className={styles.logoText}>StartupNexus</h1>
                <nav className={styles.navBar}>
                    <button className={`${styles.navItem} ${styles.active}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#00DC82"/>
                        </svg>
                        Home</button>
                    <button className={`${styles.navItem} ${styles.active}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.9 0-7.2 2.1-9 5.2V22h18v-2.8c-1.8-3.1-5.1-5.2-9-5.2z" fill="#00DC82"/>
                    </svg>
                        My Network</button>
                        <button className={`${styles.navItem} ${styles.active}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#00DC82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message">
                            <path stroke="none" d="M0 0h20v20H0z" fill="none"/>
                            <path d="M8 9h8"/>
                            <path d="M8 13h6"/>
                            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/>
                        </svg>
                        Messaging</button>
                </nav>
                <div className={styles.profileSection} onClick={toggleDropdown}>
                    <div className={styles.profilePic}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.9 0-7.2 2.1-9 5.2V22h18v-2.8c-1.8-3.1-5.1-5.2-9-5.2z" fill="#00DC82"/>
                        </svg>
                    </div>
                    {isDropdownVisible && (
                        <div className={styles.dropdownMenu}>
                            <button className={styles.dropdownItem}>View Profile</button>
                            <button className={styles.dropdownItem}>Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <NewsFeed />
                </div>
                <div className={styles.centerContainer}>
                    <div className={styles.startPostSection}>
                        <button className={styles.startPostButton} onClick={togglePostModal}>
                            Start a post
                        </button>
                    </div>
                </div>
            </div>
            {isPostModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.postModal}>
                        <div className={styles.modalHeader}>
                            <h3>Create a post</h3>
                            <button className={styles.closeButton} onClick={togglePostModal}>✖</button>
                        </div>
                        <textarea placeholder="What do you want to talk about?" className={styles.postInput}></textarea>
                        <div className={styles.modalFooter}>
                            <button onClick={togglePostModal} className={styles.postButton}>Post</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}