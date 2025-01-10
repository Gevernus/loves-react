import React from 'react';
import './Order.css';


const OrderCompleted = () => {

    return (
        <div className="app">
            <div className="px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-blue text-center">Подтверждение заказа</h1>
            </div>
            <div className="flex flex-col items-center h-full px-4 py-6  order-container">
                <div className='flex flex-col flex-auto justify-center items-center'>
                    <img
                        src="/completed.png"
                        alt="Order Error"
                        className="object-contain mb-9"
                    />
                    <p className='font-medium text-2xl text-center text-blue'>Заказ оформлен</p>
                    <p className='font-normal text-lg text-center text-dark_gray'>Ваш заказ успешно оплачен и в настоящее время внимательно комплектуется в магазине.</p>
                </div>

                <button
                    className="bg-white text-pink border border-pink rounded-2xl py-4 order-button mb-4"
                >
                    Детали заказа
                </button>
                <button
                    className="bg-pink text-white border border-pink rounded-2xl py-4 order-button"
                >
                    Вернуться к покупкам
                </button>
            </div>
            
        </div>
    );
};



export default OrderCompleted;