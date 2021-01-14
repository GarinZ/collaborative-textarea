import React from 'react';
import CollaporativeTextArea from './features/text-area/CollaporativeTextArea';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="header">
        <div className="title">Collaborative TextArea</div>
        <div className="sub-title">implemention with operational transformation & socket.io</div>
      </div>
      <div className="content">
        <CollaporativeTextArea />
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
