import React, { useEffect,useState } from 'react';
import './App.css';
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import ProfileScreen from './screens/ProfileScreen'
import ManageBooks from './screens/ManageBooks'
import ManageUsers from './screens/ManageUsers'
import MyBooks from './screens/MyBooks'
import ReturnRequests from './screens/ReturnRequests'
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { db,auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ShowHistory from './screens/ShowHistory';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if(userAuth){
        //login
        console.log(userAuth);
        const usersRef = db.collection('admin').doc(userAuth.uid)

        usersRef.get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
                dispatch(login({
                  uid : userAuth.uid,
                  email: userAuth.email,
                  name : docSnapshot.data().name,
                  admin : true
                }));
            } else {
              db.collection('users').doc(userAuth.uid).get()
              .then((snapshot)=>{
                  dispatch(login({
                    uid : userAuth.uid,
                    email: userAuth.email,
                    name : snapshot.data().name,
                    admin : false
                  }));
              })   
            }
           
        });
          
      }
      else{
        //logout
        dispatch(logout());
      }
    });
    return unsubscribe;
  },[dispatch]);
  return (
    <div className="app">
      <Router>
        {!user ? (<LoginScreen/>) : (
        <Switch>
          <Route path="/profile">
            <ProfileScreen/>
          </Route>
          <Route exact path="/">
            <HomeScreen />
          </Route>
          <Route path="/login">
            <LoginScreen/>
          </Route>
          <Route path="/manageBooks">
            <ManageBooks/>
          </Route>
          <Route path="/manageUsers">
            <ManageUsers/>
          </Route>
          <Route path="/myBooks">
            <MyBooks/>
          </Route>
          <Route path="/returnRequests">
            <ReturnRequests/>
          </Route>
          <Route path="/showHistory">
            <ShowHistory/>
          </Route>
        </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
