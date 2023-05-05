import { useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import PhotoPost from './PhotoPost';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [podrobno, setPodrobno] = useState(true);
    const photoRef = useRef("");
    const [sortingMethod, setSortingMethod] = useState('Date');

    useEffect(function () {
        const getPhotos = async function () {
            const res = await fetch("http://localhost:3001/photos");
            const data = await res.json();
            if (sortingMethod == "Date") {
                data.sort((a, b) => a.date.localeCompare(b.date));
                data.reverse();
                for (var i in data) {
                    var time = parseInt(data[i].date, 10);
                    var date = new Date(time);
                    const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
                    const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    data[i].date = hourStr + " " + dateStr;
                }
                setPhotos(data);
            } else {
                const nowDate = Date.now();
                var scores = [];
                for (var i in data) {
                    var time = parseInt(data[i].date, 10);
                    var time2 = parseInt(data[i].date, 10);
                    time = nowDate - time;
                    const score = data[i].likes - (time / (12 * 3600));
                    scores.push(score);
                    var date = new Date(time2);
                    const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
                    const hourStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    data[i].date = hourStr + " " + dateStr;
                }
                for (var x in data) {
                    for (var z = 1; z < data.size; z++) {
                        if (scores[z - 1] > scores[z]) {
                            var tmp = data[z - 1];
                            data[z - 1] = data[z];
                            data[z] = tmp;
                        }
                    }
                }
                setPhotos(data);
            }
        }
        getPhotos();
    }, [podrobno, sortingMethod]);

    function handleSelect(key, event) {
        setSortingMethod(event.target.textContent);
    };

    return (
        podrobno ?
            <div>
                <br />
                <br />
                <br />
                <div className="d-flex justify-content-between border-bottom border-2 border-dark mb-2">
                    <h3>Photos:</h3>
                    <Dropdown onSelect={handleSelect}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {sortingMethod}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="Date">Date</Dropdown.Item>
                            <Dropdown.Item eventKey="Relavancy">Relavancy</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>


                <div>
                    {photos.map(photo => (
                        <>
                            <Photo photo={photo} key={photo._id}></Photo>
                            <button className="btn btn-primary ms-5" onClick={() => { setPodrobno(false); photoRef.current = photo._id }}>Podrobno</button>
                            <hr />
                        </>
                    ))}
                </div>
            </div>
            : <>
                <br />
                <br />
                <br />
                <button className="btn btn-primary ms-5" onClick={() => { setPodrobno(true); }}>&lt;-Nazaj</button>
                <br />
                <PhotoPost currentPhoto={photoRef.current} />
            </>
    );
}

export default Photos;