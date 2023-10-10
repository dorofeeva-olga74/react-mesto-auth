import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import Card from "./Card";
import CardsContext from '../contexts/CardsContext.js';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick,
    onCardLike, onCardDelete, openDeletePopup, setSelectedCardToDeleteData }) {
    //подписка на контекст     
    const currentUser = React.useContext(CurrentUserContext);
    const cards = React.useContext(CardsContext);
    return (
        <main className="content">
            <section className="profile">
                <div className="profile__group">
                    <div onClick={onEditAvatar} className="profile__avatar-set" type="button" id="open-popup-avatar">
                        <img className={"profile__avatar"} src={currentUser.avatar} alt={"Аватарка"} />
                    </div>
                    <div className="profile__info">
                        <h1 className="profile__title">{currentUser.name}</h1>
                        <button onClick={onEditProfile} id="open-popup-button" type="button" className="profile__button profile__button_add_change" />
                        <p className="profile__subtitle">{currentUser.about}</p>
                    </div>
                </div>
                <button onClick={onAddPlace} id="open-popup-button-add-card" type="button" className="profile__button profile__button_add_card" />
            </section>
            <section className="elements">
                {cards.map((card) => (
                    <Card
                        key={card._id}
                        likes={card.likes}
                        name={card.name}
                        link={card.link}
                        owner={card.owner}
                        cardData={card}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete}
                        onCardClick={onCardClick}
                        openDeletePopup={openDeletePopup}
                        setSelectedCardToDeleteData={(card) => setSelectedCardToDeleteData(card)}
                    >
                    </Card>
                ))}
            </section>
        </main>
    )
}
export default Main