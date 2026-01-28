import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContactPage from '../components/ContactPage'; // Import your existing component

const Contact = () => {
  const navigate = useNavigate();
  return (
    // We pass the "home" navigator to the existing component's onBack prop
    <ContactPage lang="ar" textColor="#3c3728" onBack={() => navigate('/')} />
  );
};

export default Contact;