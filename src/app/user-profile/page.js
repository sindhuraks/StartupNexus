'use client';

import { useEffect, useState } from "react";
import styles from "./user-profile.module.css";

export default function UserProfile({ user }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = {
                    ok: true,
                    json: async () => ({
                        id: user.id,
                        name: user.full_name,
                        role: "Full Stack Developer",
                        location: "San Francisco, CA",
                        about: "Passionate about building scalable web applications and microservices.",
                        activity: [
                            { id: 1, content: "Exploring the power of Kubernetes!" },
                            { id: 2, content: "Deploying Next.js with Docker is smooth!" },
                        ],
                        experience: [
                            { id: 1, company: "Google", role: "Software Engineer", duration: "2 yrs" },
                            { id: 2, company: "Meta", role: "Backend Developer", duration: "1 yr" },
                        ],
                        profilePicture: "https://example.com/profile-picture.jpg",
                    }),
                };

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    throw new Error("Failed to load user data");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleConnectClick = () => {
        alert(`Sent a connection request to ${user.full_name}`);
        // Add backend API call for sending connection requests here
    };

    const handleMessageClick = () => {
        alert(`Opening message dialog with ${user.full_name}`);
        // Add backend API call for messaging functionality here
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!userData) return <div className={styles.noData}>User not found</div>;

    return (
        <div className={styles.pageContainer}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.profilePicture}>
                    <button className={styles.uploadButton}>Upload Profile Picture</button>
                </div>
                <div className={styles.userInfo}>
                    <h1>{userData.name}</h1>
                    <p>{userData.role}</p>
                    <p>{userData.location}</p>
                </div>
                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button className={styles.connectButton} onClick={handleConnectClick}>
                        Connect
                    </button>
                    <button className={styles.messageButton} onClick={handleMessageClick}>
                        Message
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className={styles.section}>
                <h2>About</h2>
                <p>{userData.about}</p>
            </div>

            {/* Recent Activity Section */}
            <div className={styles.section}>
                <h2>Recent Activity</h2>
                {userData.activity.map((item) => (
                    <p key={item.id} className={styles.card}>{item.content}</p>
                ))}
            </div>

            {/* Experience Section */}
            <div className={styles.section}>
                <h2>Experience</h2>
                {userData.experience.map((item) => (
                    <p key={item.id} className={styles.card}>
                        {item.company} - {item.role} ({item.duration})
                    </p>
                ))}
            </div>
        </div>
    );
}