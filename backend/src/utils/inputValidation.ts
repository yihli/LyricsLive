export const isValidAccountUsername = (str: string): boolean => {
    const regex = /^[A-Za-z0-9_]{3,15}$/;
    return regex.test(str);
};

export const isValidEmail = (str: string): boolean => {
    const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;;
    return regex.test(str);
};