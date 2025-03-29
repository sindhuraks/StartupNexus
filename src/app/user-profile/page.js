'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Import session hook
import styles from "./user-profile.module.css";

export default function UserProfile({ user }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [infoBoxMessage, setInfoBoxMessage] = useState(""); // State for info box message
    const { data: session } = useSession(); // Get session data

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

    const handleConnectClick = async () => {
        if (!session) {
            setInfoBoxMessage("You must be logged in to send a connection request.");
            return;
        }

        try {
            const requestBody = {
                sender_email: session.user.email, // Use email from session
                receiver_email: user.email, // Receiver email from user data
            };

            const response = await fetch("http://localhost:8080/v1/connection/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setInfoBoxMessage(`Connection request sent successfully to ${user.full_name}`);
            } else {
                const errorData = await response.json();
                setInfoBoxMessage(`Failed to send connection request. Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error sending connection request:", error);
            setInfoBoxMessage("An error occurred while sending the connection request.");
        }
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
            {/* Info Box */}
            {infoBoxMessage && (
                <div className={styles.infoBox}>
                    <p>{infoBoxMessage}</p>
                    <button onClick={() => setInfoBoxMessage("")} className={styles.closeInfoBox}>
                        ✖
                    </button>
                </div>
            )}

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
