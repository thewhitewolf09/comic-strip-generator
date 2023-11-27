import React, { useState } from 'react';
import "./ComicStripForm.scss"


const ComicStripForm = ({ onSubmit }) => {
  const [panelTexts, setPanelTexts] = useState(Array(10).fill(''));

  const handleInputChange = (index, event) => {
    const newPanelTexts = [...panelTexts];
    newPanelTexts[index] = event.target.value;
    setPanelTexts(newPanelTexts);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(panelTexts);
  };

  return (
    <form className='comic-strip-form-container' onSubmit={handleSubmit}>
      <h2>Enter Text for Each Panel:</h2>
      {panelTexts.map((text, index) => (
        <div key={index} className="panel-input">
          <label htmlFor={`panel-${index + 1}`}>{`Panel ${index + 1}:`}</label>
          <input
            type="text"
            id={`panel-${index + 1}`}
            value={text}
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}
      <button type="submit">Generate Comic Strip</button>
    </form>
  );
};

export default ComicStripForm;
