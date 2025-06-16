export const handleErrorMessage = (error: any) => {
    let description = error.message;
    if (error.isAxiosError) {
        const axiosError = error as any;

        const data = axiosError.response?.data;

        if (typeof data?.error === 'string') {
            description = data.error;
        } else if (typeof data?.detail === 'string') {
            description = data.detail;
        } else if (typeof data === 'string') {
            description = data;
        } else if (typeof data === 'object') {
            // Convertimos el objeto a string legible
            description = JSON.stringify(data, null, 2);
        }
    }
    return description;
}