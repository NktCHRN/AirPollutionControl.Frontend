import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Account = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if user is not logged in
    } else {
      // Fetch user data
      fetch("https://localhost:7286/api/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isSuccessful) {
            setUser(data.data); // Set the user data
          } else {
            setError(data.error.errorMessage); // Show error if any
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        });
    }
  }, [accessToken, navigate]);

  const handleLogout = () => {
    fetch("https://localhost:7286/api/user/tokens/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed, status: " + response.status);
        }
        // If the response is empty, return a mock success object
        return {}; // Empty response, mock successful data
      })
      .then((data) => {
        // Since there's no body in the response, just assume it's successful if no error occurred
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        navigate("/login");
      })
      .catch((error) => {
        setError("Failed to log out: " + error.message);
      });
  };

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if any
  }

  if (!user) {
    return <p>Loading...</p>; // Show loading until user data is fetched
  }

  return (
    <div className="account-container">
      <h2>Your Account</h2>
      <div className="account-details">
        <p><strong>Country:</strong> {user.countryName}</p>
        <p><strong>Agglomeration:</strong> {user.agglomerationName}</p>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Middle Name:</strong> {user.middleName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        <p><strong>Patronymic:</strong> {user.patronymic}</p>
        <p><strong>Birthday:</strong> {new Date(user.birthday).toLocaleDateString()}</p>
      </div>
      <button onClick={handleLogout} className="btn">
        Logout
      </button>
    </div>
  );
};

export default Account;
