import React,{useState,useEffect} from 'react'
import Nav from '../Nav'
import './ReturnRequests.css'
import {db} from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function ReturnRequests() {
    const [Requests, setRequests] = useState([]);
    const user = useSelector(selectUser);

    
    useEffect(()=>{

        db.collection('returnRequests')
        .onSnapshot((querySnapshot) =>{
            var reqs = []
            querySnapshot.forEach((snapshot)=>{
                reqs.push(snapshot.data());
            })
            setRequests(reqs);
        })

    },[]);

    const handleApprove = (e,request) =>{
        e.preventDefault();

        db.collection('books').doc(request.bookId)
        .get((snapshot)=>{
            db.collection('books').doc(request.bookId).update({availableCount : snapshot.data().availableCount  + 1 })
        })
        db.collection('users').doc(request.uid).collection('CheckedOutBooks').doc(request.bookId).delete()
        db.collection('returnRequests').doc(request.reqId).delete().then(()=>alert("Request Approved"))
    }
    const handleDelete = (e,request) => {
        e.preventDefault();
        db.collection('returnRequests').doc(request.reqId).delete().then(()=>alert("Request Rejected"));
    }

    return (
        <div className="returnRequests">
            <Nav/>
            <div className="returnRequestsBody">
                <h1>Return Requests</h1>
                <table>
                    <tr><th>Sr. No</th><th>Book Name</th><th>Student name</th><th>Approve</th><th>Reject</th></tr>
                    {
                            Requests.map((request,index)=>{
                                return (<tr><td>{index+1}</td><td>{request.title}</td><td>{request.name}</td><td style={{cursor:'pointer'}} onClick={(e) => handleApprove(e,request)}>Approve</td><td style={{cursor:'pointer'}} onClick={(e) => handleDelete(e,request)}>Reject</td></tr>)
                            })
                        }
                </table>
            </div>
        </div>
    )
}

export default ReturnRequests
