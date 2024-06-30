import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Assuming CSS file is named TextToSpeech.css

const TextToSpeech = () => {
  const [texts, setTexts] = useState([]);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState('');

  // Function to handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tts', {
        text: text,
        language: language
      }, { responseType: 'blob' });

      const newAudio = {
        url: URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' })),
        text: text,
        language: language
      };

      setTexts([...texts, newAudio]);
      setText(''); // Clear the textarea after submission

    } catch (error) {
      console.error('Error converting text to speech', error);
      setError('Error converting text to speech. Please try again.');
    }
  };

  // Function to handle audio deletion
  const handleDeleteAudio = (index) => {
    const updatedTexts = [...texts];
    updatedTexts.splice(index, 1);
    setTexts(updatedTexts);
  };

  return (
    <div className="container">
      <h1 className="heading">Text to Speech Converter</h1>
      <div className="converter-box">
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="text" className="label">Enter Text:</label>
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Type your text here..."
            className="text-input"
          />
          <div className="select-box">
            <label htmlFor="language" className="label">Select Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              {/* Add more languages as needed */}
            </select>
          </div>
          <button type="submit" className="convert-button">Convert to Speech</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="audio-list">
        {texts.map((audio, index) => (
          <div key={index} className="audio-item">
            <p className="audio-text">{audio.text}</p>
            <audio controls className="audio-player">
              <source src={audio.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button onClick={() => handleDeleteAudio(index)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      <div className="credit text-center">
        <a href="https://www.linkedin.com/in/hassen-moussi/" target="_blank" className="credit-link">By Hassen Moussi</a>
      </div>
    </div>
  );
};

export default TextToSpeech;
