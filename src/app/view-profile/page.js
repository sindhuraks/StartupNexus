'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 
import styles from './view.profile.module.css';
import moment from "moment/moment";

export default function ViewProfile() {
    const { data: session, status } = useSession();
    const [userName, setUserName] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (session && session.user) {
            setUserName(session.user.name);
        }
    }, [session]);

    // fetch all posts by user
    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/v1/startup/user?email=${session?.user?.email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setPosts(data.startups || []);
            } else {
                console.error('Failed to fetch posts');
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchUserPosts();
        }
    }, [status]); // Add status as dependency


    return (
        <div className={styles.pageContainer}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.profilePicture}>
                    <button className={styles.uploadButton}>Upload Profile Picture</button>
                </div>
                {/* Display User Email */}
                {status === "authenticated" ? (
                    <div className={styles.userInfo}>
                        <h1>{userName}</h1>
                        <p className={styles.userText}>Full Stack Developer</p>
                        <p className={styles.userText}>San Francisco, CA</p><br></br>
                        <p className={styles.connectionsText}>284 connections</p>
                    </div>
                ) : (
                    <p className={styles.userEmail}>Not logged in</p>
                )}
            </div>

            {/* About Section */}
            <div className={styles.section}>
                <h2>About</h2>
                <p>Passionate about building scalable web applications and microservices.</p>
            </div>

            {/* Recent Activity Section */}
            <div className={styles.section}>
                <h2>Recent Activity</h2>
                <div className={styles.postsContainer}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className={styles.postCard}>
                                <h3>{post.startup_name}</h3>
                                <p>{moment(post.created_at).fromNow()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No recent activity to show</p>
                    )}
                </div>
            </div>

            {/* Experience Section */}
            <div className={styles.section}>
                <h2>Experience</h2>
                <p>Google - Software Engineer (2 yrs)</p>
                <p>Meta - Backend Developer (1 yr)</p>
            </div>
        </div>
    );
}