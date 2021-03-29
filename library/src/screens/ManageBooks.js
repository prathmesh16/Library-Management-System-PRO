import React, { useRef,useState } from 'react'
import './ManageBooks.css'
import Nav from '../Nav'
import {db,auth } from '../firebase';

function ManageBooks() {
    const [isEdit,setIsEdit] = useState(false);
    const titleRef = useRef(null);
    const countRef = useRef(null);
    const subjectRef = useRef(null);
    const authorRef = useRef(null);
    const pubDateRef = useRef(null);
    const rackRef = useRef(null);

    const idRef = useRef(null);

    const addBook = (e) => {

        e.preventDefault();

        var id = genId();
        var book = {
            id : id,
            title : titleRef.current.value,
            subject : subjectRef.current.value,
            author : authorRef.current.value,
            pub_date : pubDateRef.current.value,
            count : parseInt(countRef.current.value),
            availableCount : parseInt(countRef.current.value),
            rackNo : rackRef.current.value
        }
        console.log(book);
        db.collection('books').doc(id).set(book).then(() => {
            alert("Book Added!")
        }).catch(error => {
            alert(error.message);
        });
        titleRef.current.value="";
        authorRef.current.value="";
        subjectRef.current.value="";
        pubDateRef.current.value="";
        countRef.current.value=0;
        rackRef.current.value="";
    }

    const editBook = (e) => {
        e.preventDefault();

        idRef.current.disabled=true;

        var book = {
            title : titleRef.current.value,
            subject : subjectRef.current.value,
            author : authorRef.current.value,
            pub_date : pubDateRef.current.value,
            count : parseInt(countRef.current.value),
            rackNo : rackRef.current.value
        }
        db.collection('books').doc(idRef.current.value)
        .update(book).then(() => {
            alert("Book Updated!")
        }).catch(error => {
            alert(error.message);
        });
        titleRef.current.value="";
        authorRef.current.value="";
        subjectRef.current.value="";
        pubDateRef.current.value="";
        countRef.current.value=0;
        idRef.current.value="";
        rackRef.current.value="";
        setIsEdit(false);
    }

    const deleteBook = (e) => {

        e.preventDefault();

        db.collection('books').doc(idRef.current.value).delete()
        .then(() => {
            alert("Book deleted!")
        }).catch(error => {
            alert(error.message);
        });

    }
    const handleEdit = (e) =>{
        e.preventDefault();
        setIsEdit(true);

        db.collection('books').doc(idRef.current.value).get()
            .then((snapShot) => {
                if(snapShot.exists){
                    titleRef.current.value=snapShot.data().title;
                    countRef.current.value=snapShot.data().count;
                    authorRef.current.value=snapShot.data().author;
                    subjectRef.current.value=snapShot.data().subject;
                    pubDateRef.current.value=snapShot.data().pub_date;
                    rackRef.current.value=snapShot.data().rackNo;
                }
                else{
                    alert("Wrong ID");
                }
            });
    }

    return (
        <div className="manageBooks">
            <Nav/>
            <div className="manageBooks__body">
                <form>
                    <input ref={titleRef} placeholder="Book Title" type="text"/>
                    <input ref={authorRef} placeholder="Author" type="text"/>
                    <input ref={subjectRef} placeholder="subject" type="text"/>
                    <input ref={pubDateRef} placeholder="Published Date" type="date"/>
                    <input ref={countRef} placeholder="No of Books" type="number"/>
                    <input ref={rackRef} placeholder="Rack No" type="text"/>
                    {  !isEdit ? (<button onClick={addBook} type="submit">Add book</button>) : (<button onClick={editBook} type="submit">Save book</button>)}
                </form>
                <form>
                    <input ref={idRef} placeholder="Book ID" type="text" disabled={isEdit}/>
                    <button onClick={handleEdit} type="submit">Edit book</button>
                    <button onClick={deleteBook} type="submit">Delete book</button>
                </form>
            </div>
           
        </div>
    )
}
function genId()
{
    return (Date.now() + ( (Math.random()*100000).toFixed()));
}
export default ManageBooks

