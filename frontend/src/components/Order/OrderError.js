import React from 'react';
import './Order.css';


const OrderError = () => {

    return (
        <div className="app">
            <div className="px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-blue_с text-center">Моя корзина</h1>
            </div>
            <div className="flex flex-col items-center h-full px-4 py-6  order-container">
                <div className='flex flex-col flex-auto justify-center items-center'>
                    <img
                        src="/error.png"
                        alt="Order Error"
                        className="object-contain mb-4"
                    />
                    <p className='font-medium text-2xl text-center text-blue_с'>Что-то пошло не так :(</p>
                    <p className='font-normal text-lg text-center text-dark_gray'>К сожалению, ваша оплата не прошла. Пожалуйста, попробуйте оплатить ещё раз.</p>
                </div>

                <button
                    className="bg-pink_с text-white rounded-2xl py-4 order-button"
                >
                    Повторить оплату
                </button>
            </div>
           
        </div>
    );
};



export default OrderError;