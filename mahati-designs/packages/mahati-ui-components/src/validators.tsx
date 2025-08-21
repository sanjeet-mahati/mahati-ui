
export const required = (value: string): string => {
    return value ? "" : "This field is required.";
};

export const maxLength = (max: number) => (value: string): string => {
    return value.length <= max ? "" : `This field must be at most ${max} characters.`;
};

export const minLength = (min: number) => (value: string): string => {
    return value.length >= min ? "" : `This field must be at least ${min} characters.`;
};

export const isValidUsername = (value: string): string => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(value) ? "" : "Username can only contain alphanumeric characters and underscores.";
};

export const isValidPassword = (value: string): string => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return regex.test(value) ? "" : "Password must be 6-20 characters long, include uppercase, lowercase, and a number.";
};