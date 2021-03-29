import React,{useState,useEffect, useRef} from 'react';
import "./HomeScreen.css";
import Nav from '../Nav';
import {db} from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function HomeScreen() {

    const [Books, setBooks] = useState([]);
    const [Requests, setRequests] = useState([]);
    const user = useSelector(selectUser);
    const [userBooks,setUserBooks] = useState(0);
    const filterValue = useRef(null);
    var maxBookLimit = 5;
    var booksRow = [];

    useEffect(()=>{

        db.collection("users").doc(user.uid)
            .collection("CheckedOutBooks")
            .onSnapshot((snapshot)=>{
                setUserBooks(snapshot.size);
            })

        db.collection('checkOutRequests')
        .onSnapshot((querySnapshot) =>{
            var reqs = []
            querySnapshot.forEach((snapshot)=>{
                reqs.push(snapshot.data());
            })
            setRequests(reqs);
        })

        db.collection('books')
        .onSnapshot((querySnapshot) =>{
            var books = []
            querySnapshot.forEach((snapshot) =>{
                    books.push(snapshot.data())
            })
            setBooks(books);
        })

    },[]);

    Books.map((book,index) =>{
            return  booksRow.push(<tr><td>{index+1}</td><td>{book.title}</td><td>{book.author}</td><td>{book.subject}</td><td>{book.pub_date}</td><td>{book.rackNo}</td><td style={{cursor:'pointer'}} onClick={(e) => handleCheckReserve(e,book.id,book.availableCount,book.title)}>{book.availableCount==0 ? 'Reserve' : 'CheckOut'}</td></tr>)
    })
    const handleFilter = (e) =>{
        e.preventDefault();
        var input, filter, table, tr, td1,td2,td3,td4, i, txtValue1,txtValue2,txtValue3,txtValue4;
        input = filterValue.current.value;
        filter = input;
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td1 = tr[i].getElementsByTagName("td")[1];
            td2=  tr[i].getElementsByTagName("td")[2];
            td3=  tr[i].getElementsByTagName("td")[3];
            td4=  tr[i].getElementsByTagName("td")[4];
            if ( td1 || td2 || td3 || td4 ) {
            txtValue1 = td1.textContent || td1.innerText;
            txtValue2 = td2.textContent || td2.innerText;
            txtValue3 = td3.textContent || td3.innerText;
            txtValue4 = td4.textContent || td4.innerText;
            if (txtValue1.indexOf(filter) > -1 || txtValue2.indexOf(filter) > -1 || txtValue3.indexOf(filter) > -1 || txtValue4.indexOf(filter) > -1  ) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
            }       
        }
    }

    

    function handleCheckReserve(e,id,cnt,title){
        e.preventDefault();

        if(userBooks>=maxBookLimit)
        {
            alert("Maximum Book Limit Reached! Please return some books!")
            return;
        }
        var reqId = genId();
        var req ={
            reqId : reqId,
            bookId : id,
            uid : user.uid,
            name : user.name,
            title : title
        }
        if(cnt>0){
            db.collection('checkOutRequests')
            .doc(reqId).set(req).then(() =>{
                alert("Book request is sent");
            });
        }
        else{
            db.collection('reserveRequests')
            .doc(reqId).set(req).then(() =>{
                alert("Book request is sent");
            });
        }
        
    }

    const handleApprove = (e,request) =>{

        e.preventDefault();
        var d = new Date(( 10 * 86400000 ) + Date.now()).toJSON().slice(0,10);
        var book ={
            reqId : request.reqId,
            uid : request.uid,
            name : request.name,
            title : request.title,
            bookId : request.bookId,
            returnDate : d,
        }
        db.collection('users').doc(request.uid).collection('CheckedOutBooks')
        .get().then((snapshot)=>{
            if(snapshot.size>=maxBookLimit)
               {
                    alert("Max book limit reached");
                    return;
               } 
               db.collection('users').doc(request.uid).collection('CheckedOutBooks').doc(request.bookId).set(book);
               db.collection('books').doc(request.bookId).get()
               .then((snapshot)=>{
                   db.collection('books').doc(request.bookId).update({availableCount : snapshot.data().availableCount - 1})
               })
               db.collection('checkOutRequests').doc(request.reqId).delete().then(()=>alert("Request Approved"));
        })
        
    }
    const handleDelete = (e,request) => {
        e.preventDefault();
        db.collection('checkOutRequests').doc(request.reqId).delete().then(()=>alert("Request Rejected"));
    }
    function genId()
    {
        return (Date.now() + ( (Math.random()*100000).toFixed()));
    }
    return (
        <div className='homeScreen'>
            <Nav/>
            <div className="homeScreen__contents">
                {   !user.admin && <h1>Avaliable Books</h1>}
                {!user.admin && <input type="text" ref={filterValue} placeholder="search here..." onChange={(e)=>handleFilter(e)}/>}
                { !user.admin &&
                    <table id="myTable">
                        <tr><th>Sr No.</th><th>Title</th><th>Author</th><th>Subject</th><th>Published Date</th><th>Rack No.</th><th>Checkout/Reserve</th></tr>
                        {
                           booksRow
                        }
                    </table>
                }
                {   user.admin && <h1>Issue Requests</h1>}
                {
                    user.admin &&
                    <table>
                        <tr><th>Sr. No</th><th>Book Name</th><th>Student name</th><th>Approve</th><th>Reject</th></tr>
                        {
                            Requests.map((request,index)=>{
                                return (<tr><td>{index+1}</td><td>{request.title}</td><td>{request.name}</td><td style={{cursor:'pointer'}} onClick={(e) => handleApprove(e,request)}>Approve</td><td style={{cursor:'pointer'}} onClick={(e) => handleDelete(e,request)}>Reject</td></tr>)
                            })
                        }
                    </table>
                }
            </div>
            
        </div>
    )
}

export default HomeScreen;
