import React, { useState } from 'react';
import './BasketView.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Layout/Footer';

const BasketView = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [flat, setFlat] = useState('');
    const [intercom, setIntercom] = useState('');
    const [entrance, setEntrance] = useState('');
    const [floor, setFloor] = useState('');
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');

    const handleCartRedirect = () => {
        navigate('/cart'); // Redirect to the cart page
    };

    const handleRecipientRedirect = (event) => {
        event.preventDefault(); // Prevent default form submission
        // Handle form submission logic here
        console.log({ city, address });
        navigate('/recipient');
    };

    return (
        <div className="app">
            <div className="relative px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">Выбор адреса</h1>
                <div
                    onClick={handleCartRedirect}
                    className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
                    aria-label="Close">
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2 -rotate-45"></span>
                </div>
            </div>

            <form className='form-adress grid gap-2 grid-cols-2 px-4' onSubmit={handleRecipientRedirect}>
                
                <select
                className='col-span-2 my-6'
                    name="city"
                    
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    <option value="" disabled>
                        -- Выберите город --
                    </option>
                    <option value="moscow" selected>Москва</option>
                    <option value="samara">Самара</option>
                    <option value="perm">Пермь</option>
                    <option value="novosibirsk">Новосибирск</option>
                </select>

                <label  className="col-span-2">                   
                    <input                        
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="text"
                        placeholder="Улица и дом"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                <label className='' >                   
                    <input                        
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="кв./офис"
                        value={flat}
                        onChange={(e) => setFlat(e.target.value)}
                    />
                </label>
                <label className='' >                   
                    <input                        
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="text"
                        placeholder="Домофон"
                        value={intercom}
                        onChange={(e) => setIntercom(e.target.value)}
                    />
                </label>
                <label className='' >                   
                    <input                        
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="Подъезд"
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                    />
                </label>
                <label className='' >                   
                    <input                        
                        className="input w-full  h-14 rounded-2xl px-4 bg-bej"
                        type="number"
                        placeholder="Этаж"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                    />
                </label>
                <label className="col-span-2" >                   
                    <input                        
                        className="input w-full h-14 rounded-2xl px-4 bg-bej"
                        type="date"
                        placeholder="Дата"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
                <label className='col-span-2 mt-8' >
                Комментарий курьеру                   
                    <textarea                        
                        className="input w-full h-32 rounded-2xl mt-6 p-4 bg-bej"
                        
                        placeholder="Ваши пожелания для доставки"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </label>

                <button
                    type="submit"
                    className="bg-pink-500 text-white rounded-full py-3 mt-8 col-span-2 ">
                    Оформить заказ
                </button>
            </form>

            <Footer />
        </div>
    );
};

export default BasketView;
