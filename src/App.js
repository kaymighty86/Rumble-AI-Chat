import './App.css';
import ChatManager from './chat_manager';

function App() {
  return (
    <div>
      <section className='main_section'>
        <div className='app_logo_container'><img src='./img/rumble chat logo.png' className='app_logo' alt="RUmble AI Logo"></img></div>
        <ChatManager/>
      </section>
      <footer>
        <p className='page_rights_text'>© Copyright 2023 <a class="developer_link" href="./">Simeon Olukayode Adeoye (Kay)</a> - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
