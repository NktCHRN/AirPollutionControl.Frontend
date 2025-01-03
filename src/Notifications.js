import React, { useEffect, useState } from "react";

function Notifications({ isLoggedIn, roles }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notificationAlert, setNotificationAlert] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch("https://localhost:7134/api/notifications?PerPage=10&Page=1", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          const data = await response.json();

          if (data.isSuccessful && data.data && data.data.data) {
            setNotifications(data.data.data);
          } else {
            setError("Failed to fetch notifications");
          }
        } catch (err) {
          setError("Error fetching notifications");
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleSendNotification = async () => {
    try {
      const response = await fetch("https://localhost:7134/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ alert: notificationAlert, recommendations }),
      });

      if (response.ok) {
        alert("Notification sent successfully");
        setNotificationAlert(""); // Reset alert input field
        setRecommendations(""); // Reset recommendations input field

        // Refetch notifications to update the UI
        await fetchNotifications();
      } else {
        const data = await response.json();
        alert("Failed to send notification: " + (data.error?.errorMessage || "Unknown error"));
      }
    } catch (err) {
      alert("Error sending notification: " + err.message);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`https://localhost:7134/api/notifications/${notificationId}/isRead`, {
        method: "PUT",  // Change to PUT
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ isRead: true }),
      });
  
      if (response.status === 204) {
        alert("Notification marked as read");
        // Refetch notifications after marking as read
        await fetchNotifications();
      } else {
        alert("Failed to mark notification as read. Status code: " + response.status);
      }
    } catch (err) {
      alert("Error marking notification as read: " + err.message);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("https://localhost:7134/api/notifications?PerPage=10&Page=1", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (data.isSuccessful && data.data && data.data.data) {
        setNotifications(data.data.data); // Update the notifications list
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      setError("Error fetching notifications");
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (!isLoggedIn) {
    return <div>No notifications. Please log in.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="notifications-container">
  <h2>Notifications</h2>

  {loading && <div className="loading-notifications">Loading notifications...</div>}
  {error && <div className="error-notifications">{error}</div>}

  {notifications.length > 0 ? (
    notifications.map((notification) => (
      <div key={notification.id} className="notification-card">
        <h3>{notification.alert}</h3>
        <p>{notification.recommendations}</p>
        <small>{new Date(notification.createdAt).toLocaleString()}</small>
        
        {/* Button to mark as read */}
        {!notification.isRead && (
          <button onClick={() => handleMarkAsRead(notification.id)} className="btn mark-read-btn">
            Mark as Read
          </button>
        )}
      </div>
    ))
  ) : (
    <p>No notifications available.</p>
  )}

  {/* Show the notification sending form if the user is an AgglomerationAdmin */}
  {roles.includes("AgglomerationAdmin") && (
    <div className="send-notification-form">
      <h3>Send Notification</h3>
      <input
        type="text"
        placeholder="Alert"
        value={notificationAlert}
        onChange={(e) => setNotificationAlert(e.target.value)}
        className="form-input"
      />
      <textarea
        placeholder="Recommendations"
        value={recommendations}
        onChange={(e) => setRecommendations(e.target.value)}
        className="form-input"
      />
      <button onClick={handleSendNotification} className="btn send-btn">
        Send Notification
      </button>
    </div>
  )}
</div>

  );
}

export default Notifications;
