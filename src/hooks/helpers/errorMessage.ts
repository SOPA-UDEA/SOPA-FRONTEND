interface ErrorResponse {
    error?: string;
    detail?: string;
}

interface AxiosError {
    isAxiosError: boolean;
    message: string;
    response?: {
        data?: ErrorResponse;
    };
}

export const handleErrorMessage = (error: AxiosError | Error) => {
    let description = error.message;
    if ('isAxiosError' in error && error.isAxiosError) {
        const axiosError = error as AxiosError;

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