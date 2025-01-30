import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api/admin";
const uploadUrl = "http://localhost:8000/api/upload"; // Эндпоинт загрузки файлов
const baseUrl = "http://localhost:8000"; // Базовый URL для формирования полного пути

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    }
    return fetchUtils.fetchJson(url, options);
};

// Функция загрузки файла (отправка в `multer`)
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("imageFile", file.rawFile); // `rawFile` - это сам загруженный файл

    const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Ошибка загрузки файла");
    }

    const result = await response.json();
    return `${baseUrl}${result.url}`; // Генерируем полный URL
};

// Обёртка над `simpleRestProvider`, добавляющая загрузку изображений
const customDataProvider = {
    ...simpleRestProvider(apiUrl, httpClient),

    // Перехватываем `create` (создание товара)
    create: async (resource, params) => {
        let imageUrl = params.data.image; // Оставляем старое значение, если нового нет

        if (params.data.imageFile && params.data.imageFile.rawFile) {
            imageUrl = await uploadFile(params.data.imageFile); // Загружаем новый файл
        }

        const newData = { ...params.data, image: imageUrl }; // Сохраняем путь в БД
        delete newData.imageFile; // Убираем `imageFile`, оно не нужно в БД

        return httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(newData),
        }).then(({ json }) => ({ data: json }));
    },

    // Перехватываем `update` (редактирование товара)
    update: async (resource, params) => {
        let imageUrl = params.data.image;

        if (params.data.imageFile && params.data.imageFile.rawFile) {
            imageUrl = await uploadFile(params.data.imageFile);
        }

        const updatedData = { ...params.data, image: imageUrl };
        delete updatedData.imageFile;

        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
        }).then(({ json }) => ({ data: json }));
    },
};

export const dataProvider = customDataProvider;
