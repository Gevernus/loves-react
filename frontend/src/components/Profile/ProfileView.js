import React from "react";
import { useSetContext } from "../../context/SetContext";
import { useProducts } from "../../context/ProductContext";
import Footer from "../Layout/Footer";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
    const { productSets, removeSet, shareSet, selectSet } = useSetContext();
    const { products, loading } = useProducts();
    const navigate = useNavigate();

    if (loading) {
        return <p>Загрузка...</p>;
    }

    const handleRemoveSet = (setId) => {
        removeSet(setId); // Assuming you have a `removeSet` function in context
    };

    const handleShareSet = (setId) => {
        shareSet(setId); // Assuming you have a `shareSet` function in context
    };

    const handleTrySet = (setId) => {
        selectSet(setId); // Assuming you have a `trySet` function in context
        navigate("/ar/lips");
    };

    return (
        <div className="app">
            {/* Header */}
            <div className="px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">Мои наборы</h1>
            </div>

            <div className="profile-content w-full mb-28 px-4 py-6">
                {productSets.length > 0 ? (
                    <div className="space-y-4">
                        {productSets.map((set) => (
                            <div
                                key={set.id}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Набор: {set.id}</h3>
                                </div>

                                {/* Set Products */}
                                <ul className="space-y-2">
                                    {set.products.map((setProduct, index) => {
                                        const fullProduct = products.find(
                                            (product) => product.id === setProduct.productId
                                        );

                                        return (
                                            <li
                                                key={index}
                                                className="flex items-center border border-gray-200 rounded-md p-3"
                                            >
                                                {fullProduct ? (
                                                    <>
                                                        <img
                                                            src={fullProduct.image}
                                                            alt={fullProduct.name}
                                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                                        />
                                                        <div>
                                                            <h4 className="text-base font-medium mb-1">
                                                                {fullProduct.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                <strong>Цена:</strong> {fullProduct.price.toFixed(2)}₽
                                                            </p>

                                                            <div className="flex gap-2 text-sm text-gray-600">
                                                                <strong>Цвет:</strong>
                                                                <div
                                                                    key={index}
                                                                    className="color-circle"
                                                                    style={{ backgroundColor: setProduct.value }}
                                                                    title={`Color ${index + 1}`}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-400">Продукт не найден</p>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="flex gap-2 justify-between mt-2.5">
                                    <button
                                        onClick={() => handleShareSet(set.id)}
                                        className="bg-[#f468a4] hover:bg-pink-400 text-white rounded-full px-3 py-1"
                                    >
                                        Поделиться
                                    </button>
                                    <button
                                        onClick={() => handleTrySet(set.id)}
                                        className="bg-[#f468a4] hover:bg-pink-400 text-white rounded-full px-3 py-1"
                                    >
                                        Примерить
                                    </button>
                                    <button
                                        onClick={() => handleRemoveSet(set.id)}
                                        className="flex items-center bg-[#e4e4e4] hover:bg-pink-400 text-white rounded-full p-2"
                                    >
                                        <img
                                            src="/trash.png"
                                            alt="Удалить"
                                            className="w-4 h-4 object-contain"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-12">
                        <p className="text-gray-500">У вас пока нет сохранённых наборов.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProfileView;
