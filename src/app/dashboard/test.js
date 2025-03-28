"use client";
import styles from "./dashboard.module.css";
import { useState } from "react";
import NewsFeed from "./newsfeed";
import UserProfile from "../user-profile/page";

export default function Dashboard() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isPostModalVisible, setPostModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Track selected user

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const togglePostModal = () => {
        setPostModalVisible((prev) => !prev);
    };

    // Handle search
    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };
    
    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && searchTerm.length > 2) {
                try {
                    const response = await fetch(`http://localhost:8080/v1/user/search?name=${searchTerm}`);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch search results: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.status === "success") {
                        setSearchResults(data.users); // Populate search results
                    } else {
                        setSearchResults([]);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }
        };

    // Handle user profile selection
    const handleSelectUser = (user) => {
        setSelectedUser(user); // Set the selected user
        setSearchResults([]); // Clear search results after selecting
    };

    return (
        <div>
            {/* Top Navigation Bar */}
            <div className={styles.horizontalbar}>
                <h1 className={styles.logoText}>StartupNexus</h1>
                <nav className={styles.navBar}>
                    <input
                        type="text"
                        className={styles.searchBar}
                        placeholder="Search people and posts..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                    />
                    <button className={`${styles.navItem} ${styles.active}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#00DC82" />
                        </svg>
                        Home
                    </button>
                    <button className={`${styles.navItem} ${styles.active}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.9 0-7.2 2.1-9 5.2V22h18v-2.8c-1.8-3.1-5.1-5.2-9-5.2z" fill="#00DC82" />
                        </svg>
                        My Network
                    </button>
                    <button className={`${styles.navItem} ${styles.active}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#00DC82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message">
                            <path stroke="none" d="M0 0h20v20H0z" fill="none"/>
                            <path d="M8 9h8" />
                            <path d="M8 13h6" />
                            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                        </svg>
                        Messaging
                    </button>
                </nav>

                <div className={styles.profileSection} onClick={toggleDropdown}>
                    <div className={styles.profilePic}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.9 0-7.2 2.1-9 5.2V22h18v-2.8c-1.8-3.1-5.1-5.2-9-5.2z" fill="#00DC82" />
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

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className={styles.searchResults}>
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className={styles.searchResultItem}
                            onClick={() => handleSelectUser(user)}
                        >
                            {user.full_name} - {user.role}
                        </div>
                    ))}
                </div>
            )}

            {/* Render UserProfile or NewsFeed */}
            <div className={selectedUser ? styles.userProfileContainer : styles.mainContainer}>
                {selectedUser ? (
                    <UserProfile user={selectedUser} />
                ) : (
                    <>
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
                    </>
                )}
            </div>

            {/* Post Modal */}
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