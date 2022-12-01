let timeoutID: number;
/**
 * delays the function call by a certain time and
 * only executes the last call in that time frame.
 * @param wait debounce time in ms.
 * @param func The function to debounce.
 * @param args Arguments of the function.
 */
function debounce(wait: number, func: Function, ...args: any):void {
    const later = () => {
        clearTimeout(timeoutID);
        func(...args);
    };
    clearTimeout(timeoutID);
    timeoutID = setTimeout(later, wait);
};

export {debounce};