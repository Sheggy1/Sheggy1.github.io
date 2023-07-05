import { useEffect, useState } from 'react';
import './App.css';

function User() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(window.prompt('Введи своє ім*я', ''));
  }, []);

  return <div className="userName"> {username} </div>;
}

export default User;
