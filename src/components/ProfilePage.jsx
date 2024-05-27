import React, { useState, useEffect } from 'react'
import '../css/ProfilePage.css'
import db from '../firebase'
import { useParams } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import Slider from "react-slick";
import styled from 'styled-components'

function ProfilePage() {
    const { idOfUser } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    
    let settings ={
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    useEffect(() => {
      const userRef = db.collection('users').doc(idOfUser);
      userRef.get().then(doc => {
        if (doc.exists) {
          setUserDetails(doc.data());
        } else {
          console.log('No such document!');
        }
      })     
    }, [])
    
    return (
        <div className='profilePage'>
            <Carousel className='userDetails_carousel' {...settings}>
                {
                    userDetails && userDetails.images && userDetails.images.map((image, index) => (
                        <Wrap key={`${userDetails.userId}image${index}`}>
                            <img src={image} alt={`userImage${index + 1}`} />
                        </Wrap>
                    ))
                }
            </Carousel>
            <div className="userDetails">
                <h1 className="userDetails_name">
                    {userDetails && userDetails.name}
                </h1>
                <p className="userDetails_bio">
                    {userDetails && userDetails.shortDesc}
                </p>
                <div className="userDetails_age">
                    <p>{userDetails && userDetails.age} years young</p>
                </div>
                <p className="userDetails_gender">
                    {userDetails && userDetails.gender}
                </p>
                <p className="userDetails_school">
                    Currently studying at - <strong>{userDetails && userDetails.school}</strong>
                </p>
                {
                    userDetails && userDetails.address && (
                        <div className="userDetails_living">
                            <p><i>Currently Lives at</i></p>
                            <div className="address">
                                <p>{userDetails.address}</p>
                                <p>{userDetails.city}</p>
                            </div>
                        </div>
                    )
                }
                <div className="userDetails_socials">
                    {
                        userDetails && userDetails.insta && userDetails.twitter && (
                            userDetails.insta && (
                                <>
                                    <a href={userDetails.insta} target="_blank"><InstagramIcon fontSize='large'className='insta_icon' /></a>
                                    <a href={userDetails.twitter} target="_blank"><TwitterIcon fontSize='large' className='twitter_icon' /></a>
                                </>
                            )           
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;

const Carousel = styled(Slider)`
    margin-top: 25px;
    margin-bottom: 0;
    
    ul li button {
        &:before {
        font-size: 10px;
        color: rgb(150, 158, 171);
        }
    }
    
    li.slick-active button:before {
      color: white;
    }

    .slick-list {
        overflow: visible;
    }
    
`
const Wrap = styled.div`
    cursor: pointer;
    height: 100%;

    img {
        width: 100%;
        border: 4px solid transparent;
        border-radius: 4px;
        height: 100%;
        box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px, rgb(0 0 0 / 73%) 0px 16px 10px -10px;
        transition-duration: 500ms;
        &:hover {
            border: 4px solid rgba(249, 249, 249, 0.8);
        }
    }
`