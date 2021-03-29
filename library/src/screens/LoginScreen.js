import {React,useState,useRef} from 'react'
import './LoginScreen.css'
import { auth } from '../firebase';

function LoginScreen() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const logIn = (e) => {
        e.preventDefault();

        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then((authUser) => {
            console.log(authUser);
        }).catch(error => {
            alert(error.message);
        });
    };

    return (
        <div className="loginScreen">
            <div className="loginScreen__background">
                <img 
                    className="loginScreen__logo"
                    src="logo.png"
                    alt="" 
                />
                <div className="loginScreen__gradient"/>
            </div>
            <div className="loginScreen__body">
                <form>
                    <h1>Log In</h1>
                    <input ref={emailRef} placeholder="Email" type="email"/>
                    <input ref={passwordRef} placeholder="Password" type="password"/>
                    <button onClick={logIn} type="submit">Log In</button>
                </form>
             
            </div>
        </div>
    )
}

export default LoginScreen
