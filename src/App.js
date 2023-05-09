import logo from './logo.svg';
import './App.css';
import ChatManager from './chat_manager';

function App() {
  return (
    <div>
      <section className='main_section'>
        <div className='app_logo_container'><img src='./img/rumble chat logo.png' className='app_logo'></img></div>
        <ChatManager/>
      </section>
      <footer>
        <p className='page_rights_text'>© Copyright 2023 KayDMighty - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
