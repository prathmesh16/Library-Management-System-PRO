import React,{useEffect, useState} from 'react'
import Nav from '../Nav'
import {db } from '../firebase';
import './ManageUsers.css'
import SignupScreen from './SignupScreen'
import Axios from 'axios';


function ManageUsers() {
    const [signUp,setSignUp] = useState(false);
    const [Users,setUsers] = useState([]);

    useEffect(()=>{
        db.collection("users")
        .onSnapshot((querySnapshot) => {
            var arr = [];
            querySnapshot.forEach((doc) => {
                arr.push(doc.data());
            });
            setUsers(arr);
        })
    },[])
  

   const deleteUser = async (e,uid)=>
    {
        e.preventDefault();
        // alert("inside")
        // return;
        const options = {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
        await Axios.get('http://localhost:8081/deleteUser?uid='+uid,options)
        .then((response)=>{
            alert(response.data.result);
        });
        
    }
    return (
        <div className="manageUsers">
        
            <Nav/>    
            {   !signUp ?
                <div className="manageUsersBody"> 
                <div style={{display:'flex'}}>
                    <h1 style={{marginTop:'15px'}}>User List</h1>
                    <button onClick={() => setSignUp(true)}> Add User </button>
                </div>
                    
                    <table >
                        <tr ><th>Sr No.</th><th>Email</th><th>Delete Member</th></tr>    
                        {
                            Users.map((user,index)=>{
                                return (<tr ><td>{index+1}</td><td id={user.uid}>{user.email}</td> <td onClick={(e)=>deleteUser(e,user.uid)} style={{cursor:'pointer'}}>Delete</td></tr>)
                            })
                        }
                    </table>
                </div>
                :   (<SignupScreen setSignUp={setSignUp}/>)
            }
        </div>
    )
}

export default ManageUsers
