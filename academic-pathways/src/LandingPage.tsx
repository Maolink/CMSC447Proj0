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
          src="https://upload.wikimedia.org/wikipedia/en/6/64/University_of_Maryland%2C_Baltimore_County_seal.svg"
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
