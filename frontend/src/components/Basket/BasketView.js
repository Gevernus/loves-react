import React, { useState } from 'react';
import './BasketView.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const BasketView = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        city: 'moscow',
        address: '',
        flat: '',
        intercom: '',
        entrance: '',
        floor: '',
        date: '',
        comment: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCartRedirect = () => {
        navigate('/cart'); // Переход на страницу корзины
    };

    const handleRecipientRedirect = (event) => {
        event.preventDefault(); // Предотвращение стандартного поведения
        // Отправка данных формы
        console.log(formData);
        navigate('/recipient');
    };

    return (
        <div className="app">
            <div className="relative px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">Выбор адреса</h1>
                <div
                    onClick={handleCartRedirect}
                    className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
                    aria-label="Закрыть">
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 -rotate-45"></span>
                </div>
            </div>

            <form className="form-address grid gap-2 grid-cols-2 mb-28 px-4" onSubmit={handleRecipientRedirect}>
                <select
                    className="col-span-2 my-6"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>
                        -- Выберите город --
                    </option>
                    <option value="moscow">Москва</option>
                    <option value="samara">Самара</option>
                    <option value="perm">Пермь</option>
                    <option value="novosibirsk">Новосибирск</option>
                </select>

                <label className="col-span-2">
                    <input
                        name="address"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="text"
                        placeholder="Улица и дом"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <input
                        name="flat"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="Кв./офис"
                        value={formData.flat}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <input
                        name="intercom"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="text"
                        placeholder="Домофон"
                        value={formData.intercom}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <input
                        name="entrance"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="Подъезд"
                        value={formData.entrance}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <input
                        name="floor"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="Этаж"
                        value={formData.floor}
                        onChange={handleInputChange}
                    />
                </label>
                <label className="col-span-2">
                    <input
                        name="date"
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                </label>
                <label className="col-span-2 mt-8">
                    Комментарий курьеру
                    <textarea
                        name="comment"
                        className="input w-full h-32 rounded-2xl mt-6 p-4 bg-bej"
                        placeholder="Ваши пожелания для доставки"
                        value={formData.comment}
                        onChange={handleInputChange}
                    ></textarea>
                </label>

                <button
                    type="submit"
                    className="bg-pink_с text-white rounded-full py-3 mt-8 col-span-2 disabled:opacity-50"
                    disabled={!formData.address || !formData.date}>
                    Оформить заказ
                </button>
            </form>

            <Footer />
        </div>
    );
};

export default BasketView;
