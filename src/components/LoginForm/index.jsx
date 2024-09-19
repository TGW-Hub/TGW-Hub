import { h } from 'preact';
import { useState } from 'preact/hooks';
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';
import './index.scss';

const maxInputCharacters = 15;

function LoginForm({ hashedPassword, homeUrl, hashedSecretKey }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [passwordVisible, setPasswordVisibility] = useState(false);
  function handleOnInput(e) {
    const currentValue = e.currentTarget.value;
    if(currentValue.length > maxInputCharacters) {
      e.currentTarget.value = currentValue.slice(0, maxInputCharacters);
      setError(true);
    } else {
      setError(false);
      setPassword(currentValue);
    }
  }
  function toggleVisibility() {
    setPasswordVisibility(!passwordVisible);
  }
  function handleOnSubmit(e) {
    e.preventDefault();
    if(!password) {
      setError(true);
      return;
    }
    const correctPassword = bcrypt.compareSync(password, hashedPassword);
    if(correctPassword) {
      Cookies.set("login-status", hashedSecretKey, {
        expires: 1,
        secure: true
      })
      window.location = homeUrl;
    } else {
      setError(true);
      alert('パスワードが違います。');
    }
    setPassword('');
  }
  return (
    <form className="login-form" onSubmit={handleOnSubmit}>
      <label for="password">パスワードを入れて下さい。</label>
      <div className="password-input-container">
        <input
          id="password"
          className={`password-input ${error ? "error" : ""}`}
          type={ passwordVisible ? "text" : "password" }
          value={password}
          onInput={handleOnInput}
          autocomplete="off"
        />
        <button 
          className="toggle-visibility" 
          type="button"
          onClick={toggleVisibility}
        >
          <SVG 
            icon={ passwordVisible ? "visible" : "invisible" }
            className="visibility-icon"
          />
        </button>
      </div>
      <input type="submit" value="認証"/>
    </form>
  )
}

function SVG({ icon, className }) {
  if(icon === "visible") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className={className}><path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/></svg>
  )
  
  if(icon === "invisible") return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className={className}><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"/></svg>
  )
}

export default LoginForm;