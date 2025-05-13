import React, { useState } from 'react';

interface LandingPageProps {
  onSubmit: (major: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubmit }) => {
  const [selectedMajor, setSelectedMajor] = useState('');

  const handleSubmit = () => {
    if (selectedMajor) onSubmit(selectedMajor);
    else alert('Please select a major.');
  };

  return (
    <div style={{ fontFamily: 'Arial', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#000', color: '#ffcc00', padding: '20px', textAlign: 'center' }}>
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstyleguide.umbc.edu%2Ffiles%2F2019%2F03%2FUMBC-vertical-logo-CMYK-on-black.png&f=1&nofb=1&ipt=cd05c51f219360b99d5d495a047511a43037bb6c553736b4cdf5ce1fcfc534b8"
          alt="UMBC Logo"
          style={{ width: '80px', marginBottom: '10px' }}
        />
        <h1>UMBC Course Planner</h1>
        <p>Your pathway to success</p>
      </header>

      <main style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2>Select Your Major</h2>
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          style={{ fontSize: '16px', padding: '10px', marginTop: '20px' }}
        >
          <option value="">-- Select Major --</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Physics">Physics</option>
          <option value="Mathematics">Mathematics</option>
        </select>

        <br />
        <button
          onClick={handleSubmit}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#ffcc00',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
