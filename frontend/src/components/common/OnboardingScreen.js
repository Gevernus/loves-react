import React, { useState } from 'react';
import './OnboardingScreen.css';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OnboardingScreen = () => {
    const { t } = useTranslation();
    const { user, setOnboarded } = useUser();
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState({
        checkCare: true,
        checkDecorate: true,
        checkWeight: true,
        checkAccessories: true,
    });

    const handleCheckboxChange = (category) => {
        setSelectedCategories((prevState) => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    const handleContinue = async () => {
        await setOnboarded({ selectedCategories });
        navigate('/');
        console.log('Onboarding completed:', user);
    };

    return (
        <div className="onboarding-screen">
            <img
                src="/onboarding.png"
                alt="Empty Cart"
                className="object-contain mb-4"
            />
            <div className="background-image">
                <div className="overlay">
                    <h2>{t("What are you interested in?")}</h2>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkCare}
                                onChange={() => handleCheckboxChange('checkCare')}
                            />
                            {t("Care Cosmetics")}
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkDecorate}
                                onChange={() => handleCheckboxChange('checkDecorate')}
                            />
                            {t("Decorative cosmetics")}
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkWeight}
                                onChange={() => handleCheckboxChange('checkWeight')}
                            />
                            {t("Slimming aids")}
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkAccessories}
                                onChange={() => handleCheckboxChange('checkAccessories')}
                            />
                            {t("Accessories")}
                        </label>
                    </div>
                    <button className="continue-button" onClick={handleContinue}>
                        {t("Continue")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
