import React, { useState, useEffect } from 'react';
import Footer from '../Layout/Footer';
import { useUser } from '../../context/UserContext';
import WebApp from '@twa-dev/sdk';
import { useTranslation } from 'react-i18next';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const BonusesView = () => {
    const { t } = useTranslation();
    const { user, selectReward } = useUser();
    const [levelData, setLevelData] = useState({
        level: 0,
        rewards: {},
        nextLevelData: {},
        isRewardsSelected: false,
    });
    const [cashback, setCashback] = useState(null);
    const [cashbackLoading, setCashbackLoading] = useState(true);
    const [levelLoading, setLevelLoading] = useState(true);
    const [isSelectingReward, setIsSelectingReward] = useState(false);

    useEffect(() => {
        const fetchCashback = async () => {
            try {
                // Fetch the cashback from the API
                const response = await fetch(`${apiUrl}/${user._id}/cashback`);

                if (!response.ok) {
                    throw new Error("Failed to fetch cashback");
                }

                const data = await response.json();

                // Set the cashback value from the response
                setCashback(data.cashback);
            } catch (error) {
                console.error(error);
            } finally {
                setCashbackLoading(false);
            }
        };

        fetchCashback(); // Call the async function to fetch cashback
    }, [user]);

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const response = await fetch(`${apiUrl}/${user._id}/level`);

                if (!response.ok) {
                    throw new Error('Failed to fetch level data');
                }

                const data = await response.json();

                // Update state with the response data
                setLevelData(data);
            } catch (error) {
                console.error(error);  // Store error message
            } finally {
                setLevelLoading(false);  // Set loading to false once the request is done
            }
        };

        fetchLevelData();
    }, [user]);

    const handleSelectReward = async (rewardType) => {
        try {
            setIsSelectingReward(true);

            const success = await selectReward(
                rewardType,
                levelData.rewards[rewardType]
            );
        } catch (error) {
            console.error('Error selecting reward:', error);
        } finally {
            setIsSelectingReward(false);
        }
    };

    const handleAddFriend = async () => {
        try {
            const response = await fetch(`${apiUrl}/share-links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user._id,
                    selectedProducts: []
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create share link');
            }

            const data = await response.json();

            // Open the generated Telegram link
            WebApp.openTelegramLink(`https://t.me/share/url?url=${data.telegramLink}`);
        } catch (error) {
            console.error('Error sharing set:', error);
        }
    };

    const calculateProgress = () => {
        if (!levelData.nextLevelData) return 100;
        return Math.min((user.referrals.length / levelData.nextLevelData.referrals) * 100, 100);
    };

    return (
        <div className="app">
            <div className="px-4 py-3 border-b w-full">
                <h1 className="text-lg font-medium text-center">{t("My bonuses")}</h1>
            </div>

            <div className="profile-content w-full mb-28 py-6">
                {/* Current Status */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t("Current Status")}</h2>
                    <div className="space-y-2">
                        <p className="text-lg font-medium">{t("Level")} {levelData.level}</p>
                        <p>{t("Friends")} {user.referrals.length}</p>
                        <p>{t("Cashback balance:")} {cashback} ₽</p>
                    </div>
                    <div
                        className="p-4 mt-2 rounded-lg border border-[#f468a4] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {user.reward?.type === 'oneTime' && (
                            <div className="flex flex-col">
                                <span className="font-semibold mb-1">{t("One-time discount")} {user.reward.value}%</span>
                                <span className="text-sm text-gray-600">{t("Can be used once for any purchase")}</span>
                            </div>
                        )}
                        {user.reward?.type === 'permanent' && (
                            <div className="flex flex-col">
                                <span className="font-semibold mb-1">{t("Permanent discount")} {user.reward.value}%</span>
                                <span className="text-sm text-gray-600">{t("Applies to all purchases")}</span>
                            </div>
                        )}
                        {user.reward?.type === 'cashback' && (
                            <div className="flex flex-col">
                                <span className="font-semibold mb-1">{t("Cashback")} {levelData.rewards.cashback}%</span>
                                <span className="text-sm text-gray-600">{t("From the amount of your friends' purchases")}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress to Next Level */}
                {levelData.nextLevelData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">{t("To the next level")}</h2>
                        <div className="space-y-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#f468a4] h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                            <p>{t("The only thing left to invite:")} {Math.max(levelData.nextLevelData.referrals - user.referrals.length, 0)} {t("friends")}</p>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleAddFriend}
                                className="bg-[#f468a4] text-white px-6 py-2 rounded-lg hover:bg-[#e54b8c] transition-colors w-48"
                            >
                                {t("Invite a friend")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Level Rewards Selection - Only shown if reward hasn't been selected */}
                {levelData && levelData.level > 0 && !levelData.isRewardsSelected && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">{t("Choose a reward")}</h2>
                            <span className="text-sm text-[#f468a4]">{t("New level!")}</span>
                        </div>
                        <p className="mb-4">
                            {t("Congratulations on reaching level")} {levelData.level}{t("! Choose one of the rewards:")}
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                className="p-4 rounded-lg border border-[#f468a4] hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSelectReward('permanent')}
                                disabled={isSelectingReward}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold mb-1">{t("Permanent discount")} {levelData.rewards.permanent}%</span>
                                    <span className="text-sm text-gray-600">{t("Applies to all purchases")}</span>
                                </div>
                            </button>
                            <button
                                className="p-4 rounded-lg border border-[#f468a4] hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSelectReward('oneTime')}
                                disabled={isSelectingReward}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold mb-1">{t("One-time discount")} {levelData.rewards.oneTime}%</span>
                                    <span className="text-sm text-gray-600">{t("Can be used once for any purchase")}</span>
                                </div>
                            </button>
                            <button
                                className="p-4 rounded-lg border border-[#f468a4] hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSelectReward('cashback')}
                                disabled={isSelectingReward}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold mb-1">{t("Cashback")} {levelData.rewards.cashback}%</span>
                                    <span className="text-sm text-gray-600">{t("From the amount of your friends' purchases")}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {user.selectedRewards.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">{t("Rewards history")}</h2>
                        <div className="space-y-3">
                            {user.selectedRewards.map((reward, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b">
                                    <span>{t("Level")} {index + 1}</span>
                                    <span className="text-gray-600">
                                        {reward === 'permanent' && t('Permanent discount')}
                                        {reward === 'oneTime' && t('One-time discount')}
                                        {reward === 'cashback' && t('Cashback')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BonusesView;