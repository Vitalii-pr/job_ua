import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'user_table', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName?.split(' ')[0] || '',
          surname: user.displayName?.split(' ')[1] || '',
          email: user.email,
          photo: user.photoURL,
          role: 'employee',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      console.log('User signed in and added to Firestore');
      onLogin(user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Помилка входу через Google. Спробуйте ще раз.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        // Sign up with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Add user to Firestore
        const userRef = doc(db, 'user_table', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          name: name,
          surname: surname,
          email: user.email,
          role: 'employee',
          created_at: new Date(),
          updated_at: new Date(),
        });
        
        console.log('User signed up and added to Firestore');
        onLogin(user);
      } else {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in with email');
        onLogin(userCredential.user);
      }
    } catch (error) {
      console.error('Error with email auth:', error);
      
      if (error.code === 'auth/invalid-credential') {
        setError('Неправильний email або пароль.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Цей email вже використовується. Спробуйте увійти.');
      } else if (error.code === 'auth/weak-password') {
        setError('Пароль має містити щонайменше 6 символів.');
      } else {
        setError('Виникла помилка. Будь ласка, спробуйте ще раз.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-sidebar">
        <div className="logo-container">
          <img src="/logo.svg" alt="Job UA Logo" className="logo" />
        </div>
        <div className="sidebar-content">
          <h1>Job UA</h1>
          <h2>Платформа для пошуку роботи та працівників</h2>
          <p>Знайдіть роботу своєї мрії або спеціаліста для вашої компанії</p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <h3>Швидкий пошук</h3>
                <p>Знайдіть роботу або працівника за декілька хвилин</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📝</div>
              <div className="feature-text">
                <h3>Зручний профіль</h3>
                <p>Детальний профіль з усією необхідною інформацією</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <div className="feature-text">
                <h3>Прямий контакт</h3>
                <p>Зв'яжіться напряму з роботодавцем або кандидатом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-content">
        <div className="login-form-container">
          <h2>{isSignUp ? 'Реєстрація' : 'Вхід'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleEmailLogin} className="login-form">
            {isSignUp && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Ім'я</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">Прізвище</label>
                  <input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required={isSignUp}
                    className="form-control"
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                minLength={6}
              />
            </div>
            
            {!isSignUp && (
              <div className="forgot-password">
                <a href="#reset-password">Забули пароль?</a>
              </div>
            )}
            
            <button type="submit" className="login-button">
              {isSignUp ? 'Зареєструватися' : 'Увійти'}
            </button>
          </form>
          
          <div className="divider">
            <span>або</span>
          </div>
          
          <button onClick={handleGoogleLogin} className="google-login-btn">
            <img src="/google-icon.svg" alt="Google" className="google-icon" />
            {isSignUp ? 'Зареєструватися через Google' : 'Увійти через Google'}
          </button>
          
          <div className="toggle-form">
            {isSignUp ? (
              <p>Вже маєте акаунт? <button onClick={() => setIsSignUp(false)}>Увійти</button></p>
            ) : (
              <p>Немає акаунту? <button onClick={() => setIsSignUp(true)}>Зареєструватися</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
