import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import TinderCard from 'react-tinder-card'
import db from '../firebase'
import { useNavigate } from 'react-router-dom';

function Home({user}) {
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);

    useEffect(() => {
        db.collection('users').onSnapshot(async snapshot => {
            const data = snapshot.docs.map((doc) => doc.data())
            const currentUserData = await db.collection('users').doc(user.userId).get().then(data => {
                return data.data()
            })
            const filteredPeopleIds = currentUserData.interactedWith.map(person => {
                return person.userId
            })
            const filteredPeople = data.filter(person => {
                return !filteredPeopleIds.includes(person.userId) && person.userId !== currentUserData.userId
            })
            setPeople(filteredPeople)
        })
    }, [])

    const swiped = async (direction, usersId) => {
        if (direction === 'left') {
            navigate(`/profilePage/${usersId}`)
        } else if (direction === 'up') {

            console.log('interested')
            
            const swipedUpOnUser = await db.collection('users').doc(usersId).get().then(doc => doc.data())

            await db.collection('users').doc(user.userId).get().then(async (snapshot) => {
                const currentUserData = snapshot.data()

                await db.collection('users').doc(user.userId).update({
                    swipedUp: [ ...currentUserData.swipedUp, swipedUpOnUser ],
                    interactedWith: [ ...currentUserData.interactedWith,  swipedUpOnUser ]
                })
            })

            swipedUpOnUser.swipedUp.map(person => {
                if (person.userId === user.userId) {
                    navigate(`/matchPage/${swipedUpOnUser.userId}`)
                }
            })

        } else if (direction === 'down') {

            console.log('not interested')

            const swipedDownOnUser = await db.collection('users').doc(usersId).get().then(doc => doc.data())

            await db.collection('users').doc(user.userId).get().then(async (snapshot) => {
                const currentUserData = snapshot.data()

                await db.collection('users').doc(user.userId).update({
                    interactedWith: [ ...currentUserData.interactedWith,  swipedDownOnUser ]
                })
            })

        } else {
            console.log('do nothing')
        }
    }

    return (
        <div className='home'>
            <div className="cards_container">
                {
                    people.length > 0 ? (
                        <>
                            {people.map((person, index) => (
                                <TinderCard
                                    className="swipe"
                                    key={person.userId}
                                    preventSwipe={['right', 'left']}
                                    onSwipe={(dir) => swiped(dir, person.userId)}
                                >
                                    <div className="card"
                                        style={{ backgroundImage: `url(${person.images[0]})` }}
                                        
                                    ></div>
                                    <div className="person_info">
                                        <h1 className='person_name'>{person.name}</h1>
                                        <p className='age_and_gender'>{person.age}, {person.gender}</p>
                                        <p className="short_desciption">{person.shortDesc}</p>
                                    </div>
                                </TinderCard>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="no_people_left">
                                <h1>You dont seem to  have any people available people left 😭😭, try talking to people you have already matched with!!😄😁</h1>
                            </div>
                        </>
                    )
                }
            </div>
        </div>  
    )
}

export default Home