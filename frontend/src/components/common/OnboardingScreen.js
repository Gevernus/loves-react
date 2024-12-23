import React, { useState } from 'react';
import './OnboardingScreen.css';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const OnboardingScreen = () => {
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
                    <h2>Что вас интересует?</h2>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkCare}
                                onChange={() => handleCheckboxChange('skincare')}
                            />
                            Уходовая косметика
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkDecorate}
                                onChange={() => handleCheckboxChange('makeup')}
                            />
                            Декоративная косметика
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkWeight}
                                onChange={() => handleCheckboxChange('slimming')}
                            />
                            Средства для похудения
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategories.checkAccessories}
                                onChange={() => handleCheckboxChange('accessories')}
                            />
                            Аксессуары
                        </label>
                    </div>
                    <button className="continue-button" onClick={handleContinue}>
                        Продолжить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
