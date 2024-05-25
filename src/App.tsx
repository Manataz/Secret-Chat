import React from 'react';
import './App.scss';
import { Button, Flex } from 'antd';
import Intro from './ui/pages/intro/Intro';
import Login from './ui/pages/login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './ui/pages/signup/SignUp';
import CodeVerfication from './ui/pages/codeVerfication/CodeVerfication';
import PersonalInfo from './ui/pages/personalInfo/PersonalInfo';
import Home from './ui/pages/home/Home';
import TermsOfUse from './ui/pages/TermsOfUse/TermsOfUse';
import LastMeets from './ui/pages/LastMeets/LastMeets';
import JoinMeet from './ui/pages/Questions/JoinMeet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/Intro" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/codeVerfication" element={<CodeVerfication />} />
        <Route path="/personalInfo" element={<PersonalInfo />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/TermsOfUse" element={<TermsOfUse />} />
        <Route path="/LastMeets" element={<LastMeets />} />
        <Route path="/JoinMeet/*" element={<JoinMeet />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
