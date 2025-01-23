import React, { createContext, useContext, useState, useMemo } from "react";

const UploadContext = createContext({
    uploadToCloudinary: async () => null,
    isUploadingPhoto: false
});

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error('useUpload must be used within an UploadProvider');
    }
    return context;
};

export const UploadProvider = ({ children }) => {
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const uploadToCloudinary = async (photoBlob) => {
        setIsUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("file", photoBlob);
            formData.append("upload_preset", "default");

            const response = await fetch("https://api.cloudinary.com/v1_1/dm31xhpot/image/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.secure_url) {
                console.log("Uploaded successfully:", data.secure_url);
                return data.secure_url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return null;
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Use useMemo to memoize the context value
    const contextValue = useMemo(() => ({
        uploadToCloudinary,
        isUploadingPhoto
    }), [isUploadingPhoto]);

    return (
        <UploadContext.Provider value={contextValue}>
            {children}
        </UploadContext.Provider>
    );
};