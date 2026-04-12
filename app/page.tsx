"use client";
import Link from 'next/link';

export default function RootPage() {
  return (
    <main style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      <a 
        href="/ll/" 
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1e293b',
          color: 'white',
          textDecoration: 'none',
          fontSize: '3rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        <span style={{ transition: 'transform 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          LL
        </span>
      </a>

      <Link 
        href="/word_imposter"
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ec4899',
          color: 'white',
          textDecoration: 'none',
          fontSize: '3rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        <span style={{ transition: 'transform 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          Word Imposter
        </span>
      </Link>
    </main>
  );
}
