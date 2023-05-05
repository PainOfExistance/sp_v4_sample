import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";

function PhotoPost(props) {
    const [photo, setPhoto] = useState([]);
    const [comments, setComments] = useState([]);
    const [upvotable, setUpvotable] = useState(true);
    const userContext = useContext(UserContext);
    const inputRef = useRef("");

    useEffect(() => {
        function getPhoto() {
            var id = "";
            fetch("http://localhost:3001/photos/" + props.currentPhoto)
                .then(x => x.json()).then(y => {
                    var time = parseInt(y.date, 10);
                    var date = new Date(time);
                    const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
                    const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    y.date = hourStr + " " + dateStr;
                    setPhoto(y);
                    id = y._id;
                    const regex = new RegExp(userContext.user.username, 'gi');
                    setUpvotable(!regex.test(y.peopleWhoLiked));
                });
            fetch("http://localhost:3001/comments/" + props.currentPhoto)
                .then(x => x.json())
                .then(y => { setComments(y); });
        }
        getPhoto();
    }, []);

    function upvote(id) {
        const data = {
            id: id,
            username: userContext.user.username
        }

        fetch("http://localhost:3001/photos/" + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }
        ).then(x => x.json()).then(y => {
            var time = parseInt(y.date, 10);
            var date = new Date(time);
            const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
            const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            y.date = hourStr + " " + dateStr;
            setPhoto(y);
        });
        setUpvotable(false);
    }

    function send() {

        const data = {
            parrentPost: photo._id,
            comment: inputRef.current.value,
            postedBy: userContext.user.username
        }

        if (inputRef.current.value != "") {
            fetch("http://localhost:3001/comments/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }
            ).then(x => x.json()).then(y => { setComments(y); });
            inputRef.current.value = "";
        }
    }

    function report(id) {
        const data = {
            id: id,
            username: userContext.user.username
        }

        fetch("http://localhost:3001/photos/report", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }
        ).then(x => x.json()).then(y => {
            var time = parseInt(y.date, 10);
            var date = new Date(time);
            const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
            const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            y.date = hourStr + " " + dateStr;
            setPhoto(y);
        });
        setUpvotable(false);
    }

    return (
        <>
            <div className="card bg-dark text-white mb-2 border border-dark border-2 w-50 ms-5">
                <img className="card-img" src={"http://localhost:3001/" + photo.path} alt={photo.name} />
                <div className="card-img-overlay">
                    <h5 className="card-title border-rounded rounded d-inline bg-dark border border-dark border-2">{photo.name}</h5>
                </div>
            </div>
            <h6 className="ms-5">Objavil: {photo.postedBy}  Ob: {photo.date}</h6>
            <h6 className="ms-5">Všečki: {photo.likes}</h6>
            {
                userContext.user ?
                    upvotable ?
                        <>
                            <button className="btn btn-primary ms-5 z-20" onClick={() => { upvote(photo._id) }}>Upvote!</button>
                            <button className="btn btn-danger ms-5 z-20" onClick={() => { report(photo._id) }}>Report!</button>
                        </>
                        :
                        <button className="btn btn-primary ms-5 z-20" disabled>Upvoted or reported!</button>
                    :
                    <>
                        <br />
                        <h6 className="ms-5">Login to upvote and comment!</h6>
                    </>
            }
            {
                userContext.user ?
                    <>
                        <br />
                        <br />
                        <h6 className="ms-5">Dodaj komentar</h6>
                        <div className="w-25 ms-5">
                            <textarea id="comment" ref={inputRef} class="form-control mb-2" rows="4" name="comment" placeholder="Komentar" required></textarea>
                            <button className="form-control mb-2" onClick={() => { send(); }}>Dodaj komentar</button>
                        </div>
                    </> :
                    <></>
            }
            <hr />
            <div className="ms-5 border-start border-dark border-2">
                {comments.map(comment => (
                    <div className="border-bottom border-dark border-2" key={comment._id}>
                        <h6 className="ms-1 d-inline">{comment.postedBy}</h6>
                        <p className="ms-1 d-inline">{comment.time}</p>
                        <p className="ms-1">{comment.comment}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default PhotoPost;