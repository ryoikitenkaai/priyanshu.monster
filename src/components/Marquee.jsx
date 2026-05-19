import React from 'react';
import './Marquee.css';

const TICKER_TEXT =
  'AVAILABLE FOR WORK · CLOUD · BACKEND · FULL-STACK · AZURE · KVM · DOCKER · ';

export default function Marquee() {
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {/* Duplicate for seamless loop */}
        <span className="marquee-content">{TICKER_TEXT.repeat(6)}</span>
        <span className="marquee-content" aria-hidden="true">{TICKER_TEXT.repeat(6)}</span>
      </div>
    </div>
  );
}
