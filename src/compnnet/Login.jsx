import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import "./styles.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";



export default function Login() {

    const particlesInit = async (main) => {
        console.log(main);
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(main);
      };
    


       
    let baseUrl = 'https://route-egypt-api.herokuapp.com/'; 

    const [user,setUser] = useState({'email':'','password':''})
    const [error,setError] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    let navigate = useNavigate();

   async function signIn (e){
        e.preventDefault();
        setIsLoading(true)

        let {data} = await axios.post(baseUrl+'signin',user)
        setIsLoading(false)


        console .log(data);
        
        if(data.message == 'success'){
            localStorage.setItem('token',data.token)
            navigate('/home')
        }else{
                setError(data.message)
            
        }
    }


    function getUser(e) {
        setUser ({...user,[e.target.name]:e.target.value})


        
    }

    return (
        <>









        <div className="container my-5 py-5">
            <div className="col-md-5 m-auto text-center">
                <form onSubmit={signIn}>
                    <div className="form-group">
                        <input onChange={getUser} placeholder="Enter email" type="email" name="email" className="form-control" />
                    </div>
                    <div className="form-group my-2">
                        <input onChange={getUser}  placeholder="Enter you password" type="password" name="password" className=" form-control" />
                    </div>
                    <button type="submit" className={'btn btn-info w-100'+ (isLoading? "disabled":"" ) }>{ isLoading? <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> : "SignIn" }</button>

                    {error && <div className="alert alert-danger mt-2">
                        {error}
                    </div>

                    }
                </form>
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