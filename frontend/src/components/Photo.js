import { Link } from "react-router-dom";
import { useState } from "react";

function Photo(props) {
    return (
        <>
            <div className="card bg-dark text-white mb-2 border border-dark border-2 w-50 ms-5">
                <img className="card-img" src={"http://localhost:3001/" + props.photo.path} alt={props.photo.name} />
                <div className="card-img-overlay">
                    <h5 className="card-title border-rounded rounded d-inline bg-dark border border-dark border-2">{props.photo.name}</h5>
                </div>
                <h6 className="border-rounded text-white rounded d-inline bg-dark border border-dark border-2">Objavil: {props.photo.postedBy}  Ob: {props.photo.date}</h6>
                <h6 className="border-rounded text-white rounded d-inline bg-dark border border-dark border-2">Všečki: {props.photo.likes}</h6>
            </div>
        </>
    );
}

export default Photo;
//<Link class="nav-link text-white" to='/PhotoPost' photo={props.photo}>Podrobno</Link>