import AxiosClient from "./AxiosClient.tsx";

const DysonApi = {
    //Product
    getNewProduct: async (): Promise<any> => {
        const url = "product/new-product"
        const response = await AxiosClient.get(url);
        return response.data
    },

    getAllProduct: async (params = {}): Promise<any> => {
        const url = "product"
        const response = await AxiosClient.get(url, { params });
        return response.data
    },

    createNewProduct: async (data: any): Promise<any> => {
        const url = "product"
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    getProductById: async (id: string): Promise<any> => {
        const url = `product/find-by-id/${id}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    getAllProductByCategory: async (category: string): Promise<any> => {
        const url = `product/find-by-category/${category}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    getAllProductByName: async (name: string): Promise<any> => {
        const url = `product/find-by-name/${name}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateProductById: async (id: string, data: any) => {
        const url = `product/update/${id}`
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    addProduct: async (data: any) => {
        const url = `product`
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    deleteProductById: async (id: string) => {
        const url = `product/delete/${id}`
        const response = await AxiosClient.delete(url);
        return response.data
    },

    //Category

    getAllCategory: async (): Promise<any> => {
        const url = "categories"
        const response = await AxiosClient.get(url);
        return response.data
    },

    getCategoryByName: async (name: string): Promise<any> => {
        const url = `categories/find-by-name/${name}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateCategoryById: async (id: string, data: any): Promise<any> => {
        const url = `categories/update/${id}`
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    addCategory: async (data: any): Promise<any> => {
        const url = `categories`
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    deleteCategoryById: async (id: string): Promise<any> => {
        const url = `categories/delete/${id}`
        const response = await AxiosClient.delete(url);
        return response.data
    },

    //Cart

    createCart: async (): Promise<any> => {
        const url = "cart"
        const response = await AxiosClient.post(url);
        return response.data._id
    },

    getCart: async (cartId: string): Promise<any> => {
        const url = "cart/" + cartId
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateCart: async (cartId: string, data: any): Promise<any> => {
        const url = "cart/update/" + cartId
        const response = await AxiosClient.put(url, data);
        return response.data
    },

    clearCart: async (cartId: string): Promise<any> => {
        const url = "cart/clear/" + cartId
        const response = await AxiosClient.put(url);
        return response.data
    },

    //order

    createOrder: async (data: any): Promise<any> => {
        const url = "order"
        const response = await AxiosClient.post(url, data);
        return response.data
    },

    getAllOrder: async (params = {}): Promise<any> => {
        const url = "order/find-all"
        const response = await AxiosClient.get(url, { params });
        return response.data
    },

    getOrderById: async (id: string): Promise<any> => {
        const url = `order/find-by-id/${id}`
        const response = await AxiosClient.get(url);
        return response.data
    },

    updateOrderStatus: async (id: string, status: string): Promise<any> => {
        const url = `order/update-status/${id}`
        const response = await AxiosClient.put(url, { status });
        return response.data
    },

    //admin
    getEmailCode: async (email: string): Promise<any> => {
        const url = 'user/get-email-code?email=' + email
        const response = await AxiosClient.get(url);
        return response.data
    },

    login: async (email: string, code: string): Promise<any> => {
        const url = 'user/login'
        const response = await AxiosClient.post(url, { email, code });
        return response.data
    },

    //file
    uploadFile: async (file: any): Promise<any> => {
        const url = 'file/upload'
        console.log(file);

        const formData = new FormData();
        const newFile = new File([file], file.name, { type: file.type })
        formData.append('file', newFile);
        console.log(formData);
        const response = await AxiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data.url
    }
};

export default DysonApi;

