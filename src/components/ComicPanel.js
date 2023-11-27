import React from 'react';
import "./ComicPanel.scss";
const ComicPanel = ({ image }) => {
  return (
    <div className="comic-panel">
      <img src={image} alt="Comic Panel" />
    </div>
  );
};

export default ComicPanel;
