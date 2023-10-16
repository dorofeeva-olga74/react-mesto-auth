const BASE_URL = "https://auth.nomoreparties.co/";

//приватный метод ответа сервера
const getResponse = (res) => {
    //console.log(res)
    if (res.ok) {
        return res.json();//дай мне ответ в формате json()
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

// Регистрация пользователя:
export const registration = async (data) => {//data /* здесь должны быть параметры */
    const res = await fetch(`${BASE_URL}signup`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),//data /* отправляем данные на сервер */
    });
    //console.log(res)
    return getResponse(res);
};
//Авторизация пользователя:
export const authorization = async (data) => {
    const res = await fetch(`${BASE_URL}signin`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    return getResponse(res);
};
//Для проверки валидности токена и получения email:
export const checkToken = async (token) => {
    const res = await fetch(`${BASE_URL}users/me`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    return getResponse(res);
}