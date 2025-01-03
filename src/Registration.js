import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './App.css'; // Assuming styles are in App.css

const Registration = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [countries, setCountries] = useState([]);
  const [agglomerations, setAgglomerations] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAgglomeration, setSelectedAgglomeration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    patronymic: '',
    birthday: '',
    password: '',
  });

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7286/api/countries?SearchText=${searchText}&PerPage=10&Page=1`);
      const data = await response.json();
      if (data.isSuccessful) setCountries(data.data.data);
      else setError(data.error.errorMessage);
    } catch {
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgglomerations = async (countryId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7286/api/agglomerations?countryId=${countryId}&PerPage=10&Page=1`);
      const data = await response.json();
      if (data.isSuccessful) setAgglomerations(data.data.data);
      else setError(data.error.errorMessage);
    } catch {
      setError('Failed to fetch agglomerations');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7286/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, agglomerationId: selectedAgglomeration }),
      });
      const data = await response.json();
      if (data.isSuccessful) {
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(data.error.errorMessage);
      }
    } catch {
      setError('Failed to register');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [searchText]);

  return (
    <div className="login-container">
      <h2 className="login-header">Registration</h2>
      <div className="login-section">
        <label className="form-label">
          Search countries:
          <input
            type="text"
            className="form-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter country name"
          />
        </label>
      </div>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {countries.length > 0 ? (
        <select
          className="dropdown"
          onChange={async (e) => {
            const selectedId = e.target.value;
            setSelectedCountry(selectedId);
            if (selectedId) {
              setLoading(true);
              setError('');
              try {
                const response = await fetch(
                  `https://localhost:7286/api/agglomerations?countryId=${selectedId}&PerPage=10&Page=1`
                );
                const data = await response.json();
                if (data.isSuccessful) {
                  setAgglomerations(data.data.data);
                } else {
                  setError(data.error.errorMessage);
                }
              } catch (err) {
                setError('Failed to load agglomerations');
              } finally {
                setLoading(false);
              }
            }
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      ) : (
        !loading && <p className="info-text">No countries match your search.</p>
      )}

      {agglomerations.length > 0 && (
        <select
          className="dropdown"
          onChange={(e) => setSelectedAgglomeration(e.target.value)}
        >
          <option value="">Select Agglomeration</option>
          {agglomerations.map((agglomeration) => (
            <option key={agglomeration.id} value={agglomeration.id}>
              {agglomeration.name}
            </option>
          ))}
        </select>
      )}
      {selectedAgglomeration && (
        <div className="form-container">
          <h3>Register</h3>
          <input
            type="text"
            className="form-input"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Patronymic"
            value={formData.patronymic}
            onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
          />
          <input
            type="date"
            className="form-input"
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button className="btn" onClick={handleRegister}>
            Register
          </button>
        </div>
      )}
      <p>
        Already have an account?{' '}
        <Link to="/login" className="link-text">Login</Link>
      </p>
    </div>
  );
};

export default Registration;
