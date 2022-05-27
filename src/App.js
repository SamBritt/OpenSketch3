import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { Profile, Landing, ImageDetail } from './pages'
import { useState } from 'react';

function App() {

  return (
    <div className="bg-stone-900 min-h-screen">
      <nav className='w-full p-4 bg-stone-900 text-gray-200'>
        <ul className='flex flex-row justify-between gap-4 rounded-full'>
          <div className='flex flex-row items-center gap-8'>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/profile">Sam</Link>
            </li>

            <li>
              <Link to="/profile">About</Link>
            </li>
          </div>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path =":id" element={<ImageDetail />} />

        </Route>
      </Routes>

      <footer className='flex justify-around items-center h-48 w-full bg-black text-stone-200 p-8'>
        <div>
          <h1 className='text-2xl'>Open Sketch</h1>
        </div>

        <div>
          <ul>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
