import React, { useState ,useEffect } from 'react'
import Nav from '../Nav'
import './ShowHistory.css'
import {db} from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function ShowHistory() {
    const [results,setResults] = useState([])
    const user = useSelector(selectUser);
    var tableRows = []

    useEffect(()=>{
        var ref = db.collection('users');
    
        ref.get().then((snapshot)=>{
            var usersId = []
            snapshot.forEach((snapshot1)=>{
                usersId.push(snapshot1.data().uid);
            })
            var res = []
            var j=1;
            for(var i =0 ;i<usersId.length ; i++)
            {
                ref.doc(usersId[i]).collection('CheckedOutBooks')
                .get().then((snapshot2)=>{
                    snapshot2.forEach((snapshot3)=>{
                        res.push(snapshot3.data());
                        var result = snapshot3.data();
                        
                        tableRows.push(<tr><td>{j}</td><td>{result.name}</td><td>{result.title}</td><td>{new Date( new Date(result.returnDate).getTime()-( 10 * 86400000 ) ).toJSON().slice(0,10)}</td><td>{result.returnDate}</td></tr>)
                        j++;
                    })
                    
                })           
                
            }
            // setResults(res);
            // console.log(results)
            // results.map((result,index)=>{
            //     return 
            // })
            setTimeout(()=>{
                console.log(res);
                setResults(tableRows)
            }, 2000);
            
            
        })

    },[]);
    
    

    return (
        <div className="showHistory">
            <Nav/>
            <div className="showHistoryBody">
                <h1>History</h1>
                <table>
                    <tr><th>Sr No.</th><th>Student Name</th><th>Book Name</th><th>Issued Date</th><th>Return Date</th></tr>
                    {
                        results
                    }
                </table>
            </div>
        </div>
    )
}

export default ShowHistory
