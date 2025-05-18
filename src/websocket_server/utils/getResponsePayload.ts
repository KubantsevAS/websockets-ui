export const getRegistrationPayload = ({ name, index }: { name: string; index: string }): string => {
    return JSON.stringify({
        name,
        index,
        error: false,
        errorText: '',
    });
};
