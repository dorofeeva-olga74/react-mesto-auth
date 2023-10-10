import React from 'react';

export default function CardDeletePopup(props) {
  const { isOpen, onClose, onCloseOverlay, handleCardDelete } = props;

  return (
    <div className={`popup popup_type_delete-card-form ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={onCloseOverlay} onClick={e => e.stopPropagation()}>{/*чтобы не закрывалось при клике на саму форму*/}
      <div className={`popup__form`}>
        <div className="popup__container">
          <h2 className="popup__title">Вы уверены?</h2>
          <button onClick={handleCardDelete} type={'button'} className={"popup__button"}
          >Да</button>
        </div>
        <button id={"close-popup-button"} type={"button"} aria-label={"Закрыть"}
          onClick={onClose} className={"popup__close-button"} />
      </div>
    </div>
  );
}