import React,{useEffect, useState} from 'react'
import Nav from '../Nav'
import './MyBooks.css'
import {db} from '../firebase'
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function MyBooks() {
    const [myBooks,setMyBooks] = useState([]);
    const user = useSelector(selectUser);

    useEffect(()=>{
        db.collection('users').doc(user.uid).collection('CheckedOutBooks')
        .onSnapshot((querySnapshot)=>{
            var books = []
            querySnapshot.forEach((snapshot)=>{
                    books.push(snapshot.data())
            })
            setMyBooks(books)
        })
    },[])

    const handleReturn = (e,book) =>{
        e.preventDefault();
        
        var reqId = genId();
        var req ={
            reqId : reqId,
            bookId : book.bookId,
            uid : user.uid,
            name : user.name,
            title : book.title
        }
        
        db.collection('returnRequests')
        .doc(reqId).set(req).then(() =>{
            alert("Book return request is sent");
        });
        

    }

    const handleRenew= (e,book) =>{
        e.preventDefault();
    
        var d = new Date(( 10 * 86400000 ) + new Date(book.returnDate).getTime()).toJSON().slice(0,10);
        db.collection('users').doc(user.uid)
        .collection('CheckedOutBooks').doc(book.bookId).update({returnDate : d}).then(()=>alert("Book Renewed"))
 
    }
    function genId()
    {
        return (Date.now() + ( (Math.random()*100000).toFixed()));
    }
    return (
        
        <div className="myBooksScreen">
            <Nav/>
            <div className="myBooksScreenBody">
                <h1>My Issued Books</h1>
                <table>
                    <tr><th>Sr No.</th><th>Book Name</th><th>Issued Date</th><th>Return Date</th><th>Return</th><th>Renew</th></tr>
                    {
                        myBooks.map((book,index)=>{
                            return (<tr><td>{index+1}</td><td>{book.title}</td><td>{new Date( new Date(book.returnDate).getTime()-( 10 * 86400000 ) ).toJSON().slice(0,10)}</td><td>{book.returnDate}</td><td onClick={(e)=>handleReturn(e,book)}>Return</td><td onClick={(e)=>handleRenew(e,book)}>Renew</td></tr>)
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default MyBooks
