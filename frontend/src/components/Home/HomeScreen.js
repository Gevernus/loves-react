import React from 'react';
import { categories } from '../../data/categories';
import CategoryCard from './CategoryCard';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import OnboardingScreen from '../common/OnboardingScreen';
import { useUser } from '../../context/UserContext';

const HomeScreen = () => {
    const { user } = useUser();

    if (user && !user.isOnboarded) {
        return <OnboardingScreen />;
    }
    return (
        <div className="app">
            <Header />
            <div className="max-w-7xl mx-auto px-4 mb-[65px]">
                <div className="grid grid-cols-2 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            id={category.id}
                            title={category.title}
                            image={category.image}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomeScreen;