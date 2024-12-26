import React, { useState } from 'react';
import './RecipientView.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const RecipientView = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        middlename: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCartRedirect = () => {
        navigate('/cart'); // Переход на страницу корзины
    };

    const handlePaymentRedirect = (event) => {
        event.preventDefault();
        console.log(formData); // Отправка данных формы
        navigate('/payment'); // Переход на страницу оплаты
    };

    const isFormValid = formData.surname && formData.name && formData.email && formData.phone;

    return (
        <div className="app">
            <div className='container-recipient'>
                <div className="relative px-4 py-3 border-b w-full">
                    <h1 className="text-lg font-medium text-center">Оформление заказа</h1>
                    <div
                        onClick={handleCartRedirect}
                        className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
                        aria-label="Закрыть">
                        <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 rotate-45"></span>
                        <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 -rotate-45"></span>
                    </div>
                </div>
                <form className="form-recipient flex flex-col gap-4 w-full mt-8 px-4" onSubmit={handlePaymentRedirect}>
                    <h2 className="w-full text-lg font-medium text-left">Введите данные получателя</h2>

                    <label className="w-full">
                        <input
                            className="input w-full h-14 rounded-2xl px-4 bg-bej"
                            type="text"
                            name="surname"
                            placeholder="Фамилия*"
                            required
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="w-full">
                        <input
                            className="input w-full h-14 rounded-2xl px-4 bg-bej"
                            type="text"
                            name="name"
                            placeholder="Имя*"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="w-full">
                        <input
                            className="input w-full h-14 rounded-2xl px-4 bg-bej"
                            type="text"
                            name="middlename"
                            placeholder="Отчество"
                            value={formData.middlename}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="w-full">
                        <input
                            className="input w-full h-14 rounded-2xl px-4 bg-bej"
                            type="email"
                            name="email"
                            placeholder="Email*"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="w-full">
                        <input
                            className="input w-full h-14 rounded-2xl px-4 bg-bej"
                            type="tel"
                            name="phone"
                            placeholder="Мобильный телефон*"
                            pattern="^\+?\d{10,15}$" // Регулярное выражение для проверки телефона
                            title="Введите корректный номер телефона"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </label>

                    <button
                        type="submit"
                        className="bg-pink-500 text-white rounded-full py-3 mt-4 order-button disabled:opacity-50"
                        disabled={!isFormValid}>
                        Сохранить и продолжить
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default RecipientView;
