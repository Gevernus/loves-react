import React from 'react';
import './Order.css';
import OrderItem from './OrderItem';


const OrderConfirm = () => {
    
    return (
        <div className="app">
            <div className="flex justify-between px-4 py-3 border-b w-full confirm-container">
                <div className='w-3 h-3 border-2 border-transparent border-l-blue_с border-t-blue_с -rotate-45 m-1.5 shrink-0'></div>
                <h1 className="text-lg font-medium text-blue_с text-center">Подтверждение заказа</h1>
            </div>
            <div className="flex flex-col h-full w-full px-4 py-6 overflow-y-auto font-normal text-lg text-blue_с confirm-container">
                <p className='font-medium text-2xl mb-6'>Получатель</p>
                <div className='flex justify-between w-full p-4 rounded-2xl mb-8 bg-bej '>
                    <div>
                        <p className='leading-5 mb-2'>Марикадова Екатерина</p>
                        <p className='leading-5 mb-2'>+7(999)17–283–02</p>
                        <p className='leading-6'>katyamarik@mail.ru</p>
                    </div>
                    <div className='w-3 h-3 border-2 border-transparent border-r-blue_с border-t-blue_с rotate-45 m-1.5 shrink-0'></div>
                </div>
                <p className='font-medium text-2xl mb-6'>Доставка</p>
                <div className='flex justify-between w-full p-4 rounded-2xl mb-8 bg-bej '>
                    <div>
                        <p className='leading-6 mb-2'>Курьер</p>
                        <p className='leading-6 text-dark_gray'>г.Москва, ул. Петра Мстиславца 17, кв 12, домофон #542, 1 подъезд, 22 этаж</p>
                    </div>
                    <div className='w-3 h-3 border-2 border-transparent border-r-blue_с border-t-blue_с rotate-45 m-1.5 shrink-0'></div>
                </div>
                <p className='font-medium text-2xl mb-6'>Дата и время доставки</p>
                <div className='flex justify-between w-full p-4 rounded-2xl mb-8 bg-bej '>
                    <div>
                        <p className='leading-6 mb-2'>25 декабря 2024г. с 12:00 до 18:00</p>
                        <p className='leading-4 text-sm text-dark_gray'>Перед доставкой курьер позвонит вам для уточнения деталей доставки</p>
                    </div>
                    <div className='w-3 h-3 border-2 border-transparent border-r-blue_с border-t-blue_с rotate-45 m-1.5 shrink-0'></div>
                </div>
                <p className='font-medium text-2xl mb-6'>Способ оплаты</p>
                <div className='flex justify-between w-full p-4 rounded-2xl mb-8 bg-bej checkbox-order'>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked
                            />
                        </label>
                        <p className='leading-6 mb-2 ml-6'>МИР **** 8282</p>
                    </div>
                    <div className='w-3 h-3 border-2 border-transparent border-r-blue_с border-t-blue_с rotate-45 m-1.5 shrink-0'></div>
                </div>
                <p className='font-medium text-2xl mb-6'>Состав заказа</p>
                <OrderItem />
                <OrderItem />
                <OrderItem />

                <p className='font-medium text-2xl mb-4'>Итого:</p>
                <div className="space-y-2 border-dashed border-b border-seryy pb-4">
                    <div className="flex justify-between">
                        <span>Количество товаров</span>
                        <span className='font-medium'>2 шт.</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Товары на сумму</span>
                        <span className='font-medium'>4 775₽</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Доставка</span>
                        <span className='font-medium'>300₽</span>
                    </div>
                </div>
                <div className="mt-4 mb-8 flex justify-between items-center font-semibold text-xl">
                    <span>Итого</span>
                    <span>5 075₽</span>
                </div>

                <button
                    className="bg-pink_с text-white border border-pink_с rounded-2xl py-4 mb-6 order-button"
                >
                    Оплатить заказ
                </button>
                <p className='text-base leading-5 text-center text-grey'>После оплаты вы получите уведомление с номером заказа</p>
            </div>

        </div>
    );
};



export default OrderConfirm;