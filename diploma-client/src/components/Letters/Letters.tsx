import React, {FC} from 'react';
import {Letter} from "../Letter/Letter";
import './Letters.scss'

export const Letters: FC = () => {
  const letters = []
  for (let a = 'A'.charCodeAt(0); a <= 'Z'.charCodeAt(0); a++) {
    letters.push(String.fromCharCode(a))
  }

  return (
    <div className="letters">
      {letters.map((value, index) => <div key={index} className="letters__letter"><Letter value={value} /></div>)}
    </div>
  );
};