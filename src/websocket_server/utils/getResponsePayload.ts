import { IndexId } from '../types';

export const getRegistrationPayload = ({ name, index }: { name: string; index: IndexId }): string => {
    return JSON.stringify({
        name,
        index,
        error: false,
        errorText: '',
    });
};
