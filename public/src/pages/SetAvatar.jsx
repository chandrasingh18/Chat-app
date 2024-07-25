import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import loader from "../assets/loader.gif";  // Make sure you have this loader.gif in the correct path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

export default function SetAvatar() {
  const api = 'https://api.multiavatar.com/45678945'; 
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = useMemo(() => ({
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }), []);

  useEffect(()=> {
    const checkUser = async () => {
        if(!localStorage.getItem("chat-app-user")) {
            navigate("/login");
        }
    };
    checkUser();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('chat-app-user'));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar]
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate('/');
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        } catch (error) {
          toast.error("Error fetching avatars. Please try again.", toastOptions);
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, [api, toastOptions]);

  return (
    <>
      {isLoading ? (
        <img src={loader} alt="loader" />
      ) : (
        <Container>
          <div className="title-container">
            <h1>Choose your avatar</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div 
                  key={index}
                  className={`avatar ${selectedAvatar === index ? "selected" : ""}`}  
                >
                  <img 
                    src={`data:image/svg+xml;base64,${avatar}`} 
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture}>Set as Profile Picture</button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  background-color: #131324
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        cursor: pointer;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #3e0ccd;
    }
  }
`;
