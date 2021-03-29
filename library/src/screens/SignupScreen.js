import React, { useRef,useState } from 'react'
import "./SignupScreen.css"
import Axios from 'axios';

function SignupScreen({setSignUp}) {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const register = async (e) => {
        e.preventDefault();
        const options = {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
          };
        await Axios.get('http://localhost:8081/createUser?email='+emailRef.current.value+'&&password='+passwordRef.current.value+'&&name='+nameRef.current.value,options)
        .then((response)=>{
            alert(response.data.result);
            setSignUp(false);
        });
    }


    return (
        <div className="signupScreen">
            <form>
                <h1>Sign Up User</h1>
                <input ref={nameRef} placeholder="Name" type="Name"/>
                <input ref={emailRef} placeholder="Email" type="email"/>
                <input ref={passwordRef} placeholder="Password" type="password"/>
                
                <button onClick={register} type="submit">Add User</button>
                <button onClick={()=>setSignUp(false)} >Back to List</button>
            </form>
        </div>
    )
}

export default SignupScreen
