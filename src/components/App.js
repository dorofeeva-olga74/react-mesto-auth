import React, { useEffect, useState } from 'react';
import api from "../utils/Api/Api.js";
import CurrentUserContext from '../contexts/CurrentUserContext';
import CardsContext from '../contexts/CardsContext';
import LoaderContext from '../contexts/LoaderContext';

import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import CardDeletePopup from "./CardDeletePopup.js";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = useState(false);
  const [selectedCardToDelete, setSelectedCardToDelete] = useState("");
  const [selectedCard, setSelectedCard] = useState({});//для всплывающей картинки
  const [currentUser, setCurrentUser] = useState({});
  const [apiCardsState, setApiCardsState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getUserCardsData(), api.getInitialCards()])
      .then(([userInfoAnswer, cardsAnswer]) => {
        // console.log(cardsAnswer)
        setCurrentUser({ ...userInfoAnswer });
        setApiCardsState([...cardsAnswer]);
      })
      .catch((e) => console.error(e?.reason || e?.message));
  }, []);

  // добавляю обработчики  
  const handleEditAvatarClick = (e) => {
    e.preventDefault();
    setIsEditAvatarPopupOpen(true);
  }
  const handleEditProfileClick = (e) => {
    e.preventDefault();
    setIsEditProfilePopupOpen(true);
  }
  const handleAddPlaceClick = (e) => {
    e.preventDefault();
    setIsAddPlacePopupOpen(true);
  }
  const openDeletePopup = () => {
    setIsCardDeletePopupOpen(true);
  }
  //закрытие по оверлею
  const handleOverlayClick = (e) => {
    if (e.target?.className?.includes('popup')) {
      closeAllPopups();
    }
  };

  //Обработчик Escape
  const isOpen = isCardDeletePopupOpen || isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link
  useEffect(() => {
    function closeByEscape(e) {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  // Закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeletePopupOpen(false);
    setSelectedCard({})
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true)
    api.changeAvatarUrl({
      avatar: data.avatar,
    })
      .then(() => {
        closeAllPopups();
        setCurrentUser((userInfoAnswer) => ({
          ...userInfoAnswer,
          avatar: data.avatar,
        }));
        
      })
      .catch((e) => console.error(e?.reason || e?.message))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(name, about) {
    setIsLoading(true)
    api.changeUserData({
      name: name,
      about: about,
    })
      .then(() => {
        closeAllPopups();
        setCurrentUser((userInfoAnswer) => ({
          ...userInfoAnswer,
          name: name,
          about: about,
        }));
        
      })
      .catch((e) => console.error(e?.reason || e?.message))
      .finally(() => setIsLoading(false))
  }

  function setSelectedCardToDeleteData(currentCardId) {
    setSelectedCardToDelete(currentCardId)
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true)
    api.creatCardApi({
      name: data.name,
      link: data.link,
    })
      .then((newCard) => {
        closeAllPopups();
        setApiCardsState([newCard, ...apiCardsState]);        
      })
      .catch((e) => console.error(e?.reason || e?.message))
      .finally(() => setIsLoading(false))
  }
  // удаление
  function handleCardDelete() {
    api.deleteCardApi(selectedCardToDelete)
      .then(() => {
        closeAllPopups();
        setApiCardsState((state) => state.filter((cardDelete) => selectedCardToDelete !== cardDelete._id));
      })
      .catch((e) => console.error(e?.reason || e?.message))
    
  }

  function handleCardLike(card) {
    const isLiked = card.cardData.likes.some((i) => i._id === currentUser._id);
    if (isLiked) {
      api.deleteLikeCardData(card.cardData._id)
        .then((newCard) => {
          setApiCardsState((state) => state.map((c) => c._id === card.cardData._id ? newCard : c));
        })
        .catch((e) => console.error(e?.reason || e?.message))
    } else {
      api.addLikeCardData(card.cardData._id)
        .then((newCard) => {
          setApiCardsState((state) => state.map((c) => (c._id === card.cardData._id ? newCard : c)));
        })
        .catch((e) => console.error(e?.reason || e?.message))
    }
  }
  return (
    <div className="app">
      <LoaderContext.Provider value={isLoading}>
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <CardsContext.Provider value={apiCardsState}>
            <Main
              onEditProfile={handleEditProfileClick}/*новые пропсы*/
              onAddPlace={handleAddPlaceClick}/*новые пропсы*/
              onEditAvatar={handleEditAvatarClick}
              onCardClick={setSelectedCard}
              onCardLike={handleCardLike}
              onClose={closeAllPopups} /*закрытие попапов*/
              onCloseOverlay={handleOverlayClick}
              openDeletePopup={openDeletePopup}
              handleCardDelete={handleCardDelete}
              setSelectedCardToDeleteData={(data) => setSelectedCardToDeleteData(data)}//получение данных карточки для удаления
            />
          </CardsContext.Provider>
          <Footer />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            setIsOpen={setSelectedCard}
            onCloseOverlay={handleOverlayClick} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleOverlayClick}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleOverlayClick}
            onAddNewPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleOverlayClick}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <CardDeletePopup
            isOpen={isCardDeletePopupOpen}
            onClose={closeAllPopups}
            onCloseOverlay={handleOverlayClick}
            onCardDelete={handleAddPlaceSubmit}
            handleCardDelete={handleCardDelete}
          />
        </CurrentUserContext.Provider>
      </LoaderContext.Provider>
    </div>
  );
}
export default App;
