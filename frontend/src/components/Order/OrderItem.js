import React from 'react';


const OrderItem = () => {


    return (
        <div className="flex w-full rounded-2xl mb-8 bg-bej p-4 gap-4">
            <div className="w-24">
                <img
                    src="/shop-cherry.png"
                    alt="{item.name}"
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="flex-1 text-sm font-normal">
                <h3 className=" font-semibold">Rom&Nd Blur Fudge Tint</h3>
                <p className=" text-grey mt-0.5">Матовый тинт для губ</p>
                <p className=" font-medium mt-0.5">№02 Rosiental – пудрово-розовый</p>
                <p className="text-xs my-2">Количество: 1 шт</p>
                <span className="font-semibold text-base">3 180₽ ₽</span>
            </div>
        </div>
    );
};

export default OrderItem;