import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import Swal from 'sweetalert2';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


function Home() {

    const particlesInit = async (main) => {
        console.log(main);
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
      };

    let baseURL = 'https://route-egypt-api.herokuapp.com/';
    let token = localStorage.getItem('token')
    let userDecoded = jwt_decode(token)
    let userID = userDecoded._id;


    const [notes, setNotes] = useState([])
    const [note, setNote] = useState({ 'title': '', 'desc': '', userID, token })



    async function getUserNotes() {
        let { data } = await axios.get(baseURL + "getUserNotes", {
            headers: {
                userID,
                Token: token
            }
        })
        if (data.message == 'success') {
            setNotes(data.Notes)

        }
        console.log(notes);
    }

    useEffect(() => {
        getUserNotes()
    }, [])

    function getNote({ target }) {
        setNote({ ...note, [target.name]: target.value })
    }

    // console.log(note);


    async function addNote(e) {
        e.preventDefault();

        let { data } = await axios.post(baseURL + 'addNote', note)
        console.log(data);

        if (data.message == 'success') {
            document.getElementById('add-form').reset()
            getUserNotes()
        }
    }

    function deleteNote(NoteID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(baseURL + 'deleteNote', {
                    data: {
                        NoteID,
                        token
                    }
                }).then((response) => {
                    console.log(response);
                    if (response.data.message == 'deleted') {
                        getUserNotes();
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.message,
                        })
                    }
                })
            }
        })

        // console.log(data);


    }

    function getNoteID(NoteIndex) {
        console.log(notes[NoteIndex]);
        document.querySelector("#exampleModal1 input").value = notes[NoteIndex].title
        document.querySelector("#exampleModal1 textarea").value = notes[NoteIndex].desc

        setNote({ ...note, 'title': notes[NoteIndex].title, "desc": notes[NoteIndex].desc, NoteID: notes[NoteIndex]._id })
    }

    async function updateNote(e) {
        e.preventDefault();
        // console.log(note);
        let { data } = await axios.put(baseURL + 'updateNote', note)
        console.log(data);
        if (data.message == 'updated') {
            getUserNotes()
            Swal.fire(
                'Updated!',
                'Your note has been updated.',
                'success'
            )
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        }
    }

    return (
        <>
            <div className="container my-5">
                <div className="col-md-12 text-end">
                    <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add
                        New</a>
                </div>
            </div>


            {/* <!-- Add Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form id="add-form" onSubmit={addNote}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* <!-- Edit Modal --> */}
            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={updateNote} id="edit-form">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>



            {/* <!-- ==========================Notes=============================== --> */}

            <div className="container">
                <div className="row">
                    {notes.map((note, index) => {
                        return (
                            <div key={index} className="col-md-4 my-4">
                                <div className="note p-4">
                                    <h3 className="float-start">{note.title}</h3>
                                    <a onClick={() => { getNoteID(index) }} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit float-end edit"></i></a>
                                    <a onClick={() => { deleteNote(note._id) }} > <i className="fas fa-trash-alt float-end px-3 del"></i></a>
                                    <span className="clearfix"></span>
                                    <p>{note.desc}</p>
                                </div>
                            </div>
                        )
                    })}


                </div>
            </div>

            <Particles
      id="tsparticles"
      init={particlesInit}

      options={{
        "fullScreen": {
            "enable": true,
            "zIndex": 1
        },
        "particles": {
            "number": {
                "value": 10,
                "density": {
                    "enable": false,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#fff"
            },
            "shape": {
                "type": "star",
                "options": {
                    "sides": 5
                }
            },
            "opacity": {
                "value": 0.8,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 4,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "rotate": {
                "value": 0,
                "random": true,
                "direction": "clockwise",
                "animation": {
                    "enable": true,
                    "speed": 5,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 600,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 2
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": ["grab"]
                },
                "onclick": {
                    "enable": false,
                    "mode": "bubble"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true,
        "background": {
            "color": " rgba(17, 17, 17, 0.518)",
            "image": "",
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
        }
    }}
    />

        </>
    )
}

export default Home
