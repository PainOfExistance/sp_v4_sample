import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile() {
    const userContext = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [postData, setPostData] = useState([0, 0]);

    useEffect(function () {
        const getProfile = async function () {
            const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
            const data = await res.json();
            setProfile(data);
        }
        fetch("http://localhost:3001/photos/").then(y => y.json()).then(x => {
            var totalPosts = 0;
            var totalLikes = 0;
            for (var z in x) {
                if (x[z].postedBy == userContext.user.username) {
                    totalLikes += parseInt(x[z].likes, 10);
                    totalPosts += 1;
                }
            }
            setPostData([totalPosts, totalLikes]);
        })
        getProfile();
    }, []);

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1>User profile</h1>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <br />
            <p>Posts made by the user: {postData[0]}</p>
            <p>Likes user gained from posts: {postData[1]}</p>
        </>
    );
}

export default Profile;