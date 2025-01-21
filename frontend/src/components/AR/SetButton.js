import React, { useState, useEffect } from "react";
import { useSetContext } from "../../context/SetContext"; // Assuming SetContext is in the same directory
import { useNavigate } from "react-router-dom"; // For navigation to SetView

const SetButton = () => {
    const {
        selectedProducts,
        productSets,
        saveSet,
        selectSet,
    } = useSetContext();
    const navigate = useNavigate();

    const [buttonLabel, setButtonLabel] = useState("Создать набор");

    // Check if the selected products match any set
    const checkIfProductsInSet = () => {
        return productSets.find((set) => {
            // Check if lengths match
            if (set.products.length !== selectedProducts.length) {
                return false;
            }

            // Check if all products in selectedProducts match with a product in the set
            return selectedProducts.every((selected) =>
                set.products.some(
                    (product) =>
                        product.productId.toString() === selected.productId.toString() &&
                        product.value === selected.value
                )
            );
        });
    };

    useEffect(() => {
        const matchingSet = checkIfProductsInSet();
        if (matchingSet) {
            setButtonLabel("Мои наборы");
        } else {
            setButtonLabel("Создать набор");
        }
    }, [selectedProducts, productSets]);

    const handleButtonClick = () => {
        const matchingSet = checkIfProductsInSet();
        if (matchingSet) {
            // Navigate to ProfileView if selected products match an existing set
            selectSet(matchingSet.id);
            navigate("/my-sets");
        } else {
            // Create a new set and update the label
            saveSet();
            setButtonLabel("Мои наборы");
        }
    };

    return (
        <div className="flex justify-center items-center mt-4">
            {selectedProducts.length > 0 && (
                <button
                    onClick={handleButtonClick}
                    className="bg-pink_с hover:bg-light_pink text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                    {buttonLabel}
                </button>
            )}
        </div>
    );
};

export default SetButton;
