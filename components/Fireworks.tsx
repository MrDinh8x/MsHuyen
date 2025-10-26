import React from 'react';
import './fireworks.css';

export default function Fireworks(): React.ReactElement {
  return (
    <div className="fireworks-container">
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
    </div>
  );
}
