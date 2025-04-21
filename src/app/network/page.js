'use client';
import { useEffect, useState } from "react";
import styles from "./network.module.css";

export default function Networks() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      setRequests([
        {
          id: 101,
          full_name: "Priya Patel",
          role: "Business Analyst",
          location: "Austin, TX",
          linkedin_profile: "https://linkedin.com/in/priyapatel",
          profile_picture: "https://via.placeholder.com/100",
        },
        {
          id: 102,
          full_name: "Michael Lee",
          role: "Marketing Lead",
          location: "Chicago, IL",
          linkedin_profile: "https://linkedin.com/in/michaellee",
          profile_picture: "https://via.placeholder.com/100",
        },
      ]);
      setConnections([
        {
          id: 1,
          full_name: "John Doe",
          role: "Software Engineer",
          location: "San Francisco, CA",
          linkedin_profile: "https://linkedin.com/in/johndoe",
          profile_picture: "https://via.placeholder.com/100",
        },
        {
          id: 2,
          full_name: "Jane Smith",
          role: "Product Manager",
          location: "New York City, NY",
          linkedin_profile: "https://linkedin.com/in/janesmith",
          profile_picture: "https://via.placeholder.com/100",
        },
        {
          id: 3,
          full_name: "Alex Johnson",
          role: "Data Scientist",
          location: "Seattle, WA",
          linkedin_profile: "https://linkedin.com/in/alexjohnson",
          profile_picture: "https://via.placeholder.com/100",
        },
      ]);
    } catch (error) {
      setError("Failed to load network data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAccept = (id) => {
    const accepted = requests.find(r => r.id === id);
    setConnections(prev => [accepted, ...prev]);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleIgnore = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRemove = (id) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  };

  if (loading) return <div className={styles.loading}>Loading network...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.networkPage}>
      <h1 className={styles.title}>My Network</h1>

      <ul className={styles.list}>
        {/* Invitations at the top */}
        {requests.length > 0 && (
          <>
            <li className={styles.listSectionTitle}>Invitations</li>
            {requests.map(req => (
              <li key={req.id} className={styles.listItem}>
                <img src={req.profile_picture} alt={req.full_name} className={styles.profilePic} />
                <div className={styles.infoBlock}>
                  <div className={styles.name}>{req.full_name}</div>
                  <div className={styles.role}>{req.role}</div>
                  <div className={styles.location}>{req.location}</div>
                  <a href={req.linkedin_profile} target="_blank" rel="noopener noreferrer" className={styles.linkedinLink}>View LinkedIn</a>
                </div>
                <div className={styles.actions}>
                  <button className={styles.acceptButton} onClick={() => handleAccept(req.id)}>Accept</button>
                  <button className={styles.ignoreButton} onClick={() => handleIgnore(req.id)}>Ignore</button>
                </div>
              </li>
            ))}
          </>
        )}
        {requests.length === 0 && (
          <li className={styles.noRequests}>No pending invitations</li>
        )}

        {/* Connections below */}
        <li className={styles.listSectionTitle}>Your Connections</li>
        {connections.length === 0 ? (
          <li className={styles.noConnections}>No connections yet</li>
        ) : (
          connections.map(conn => (
            <li key={conn.id} className={styles.listItem}>
              <img src={conn.profile_picture} alt={conn.full_name} className={styles.profilePic} />
              <div className={styles.infoBlock}>
                <div className={styles.name}>{conn.full_name}</div>
                <div className={styles.role}>{conn.role}</div>
                <div className={styles.location}>{conn.location}</div>
                <a href={conn.linkedin_profile} target="_blank" rel="noopener noreferrer" className={styles.linkedinLink}>View LinkedIn</a>
              </div>
              <div className={styles.actions}>
                <button className={styles.removeButton} onClick={() => handleRemove(conn.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
