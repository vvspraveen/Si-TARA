import React, { useState, useEffect } from 'react'
import '@bosch/frontend.kit-npm/dist/frontend-kit.css';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import jwtDecode from "jwt-decode";
import Axios from "axios";
import Header from './Header';
import { Stack } from '@mui/material';

function ContactPage() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userFeedback, setUserFeedback] = useState("")
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      checkTokenExpiration(token);
      setUserEmail(jwtDecode(token).email)
      extractNameFromEmail(jwtDecode(token).email);
      const interval = setInterval(() => {
        checkTokenExpiration(token)
      }, 20000);
      return () => {
        clearInterval(interval)
      }
    } else {
      handleLogout()
    }
  }, []);

  const extractNameFromEmail = (email) => {
    const atIndex = email.indexOf('@');

    if (atIndex !== -1) {
      // Extract the substring after "@" and remove common separators
      const username = email.substring(0, atIndex).replace(/[._]/g, ' ');

      // Capitalize each word to make it look like a name
      const name = username
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setUserName(name);
    } else {
      // If "@" is not found, set the extracted name to null
      setUserName(null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId')
    navigate("/");
  }

  const checkTokenExpiration = (token) => {
    try {
      const { exp } = jwtDecode(token)
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (exp < currentTime) {
        // Token has expired, log the user out
        handleLogout();
      }
    } catch (error) {
      console.error('Error decoding or checking token:', error);
    }
  };
  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post("https://api.si-tara.com/userFeedback", { 'username': userName, 'email': userEmail.toLowerCase(), 'message': userFeedback });
      console.log(response.status)
      if (response.status === 200) {
        alert("Response Sent successfully")
        navigate("/")
      } else {
        alert("couldn't send the feedback")
      }
    }
    catch (error) {
      alert("Error couldn't send the feedback")
    }
  }

  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Stack direction={'column'} style={{ width: '100%' }}>
        <header className="header">
          {/* Header content goes here */}
          <Header />
        </header>
        <center>
          <div className="a-box -floating-shadow-s" style={{ width: '30rem', height: '35rem', marginTop: '4rem', borderRadius: '0.5rem' }}>
            <h3 style={{ textAlign: 'center', padding: '1.5rem 0', backgroundColor: '#008ae6', color: 'white' }}>Feedback</h3>

            <div className="o-form" style={{ padding: '2rem', margin: 0, width: '100%' }}>
              <form aria-label="Example form description" onSubmit={handleFeedbackSubmit} >
                <div className="m-form-field" style={{ paddingBottom: '1.5rem' }}>
                  <div className="a-text-field">
                    <label for="firstName">Your Name *</label>
                    <input type="text" disabled defaultValue={userName} maxlength="30" id="firstName" required style={{ borderRadius: '0.5rem', border: 0 }} />
                  </div>
                </div>
                <div className="m-form-field" style={{ paddingBottom: '1.5rem' }}>
                  <div className="a-text-field" >
                    <label for="lastName">Email *</label>
                    <input type="text" disabled defaultValue={userEmail} id="email" style={{ borderRadius: '0.5rem', border: 0 }} />
                  </div>
                </div>
                <div className="a-text-area">
                  <label for="6">Message *</label>
                  <textarea id="6" placeholder="Type Message" required maxlength="200" value={userFeedback} style={{ borderRadius: '0.5rem' }} onChange={(e) => setUserFeedback(e.target.value)}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button
                    type="submit"
                    className="a-button a-button--primary -without-icon"
                    data-frok-action="submit"
                    style={{ borderRadius: '0.5rem', border: 0 }}
                  ><span className="a-button__label">Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </center>
      </Stack>
    </div>

  )
}

export default ContactPage