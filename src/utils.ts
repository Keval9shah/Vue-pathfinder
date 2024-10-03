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

import Vue from "vue";
import { ToastType } from "vue-toast-notification";
/**
 * shows the toast with the following params.
 * 
 * css can be found at ```public/vue-toast.css```.
 * @param message message to show in the toast notification.
 * @param type type of the toast ex. success, error, info.
 * @param duration duration for the toast to stay visible.
 */
function showToast(message: string, type: ToastType, duration: number = 10000) {
    Vue.$toast.open({
        message: message,
        type: type,
        duration: duration,
    })
}

/**
 * shows the toast with the following params.
 * returns a promise that resolves when the toast is dismissed.
 * 
 * css can be found at ```public/vue-toast.css```.
 * @param message message to show in the toast notification.
 * @param type type of the toast ex. success, error, info.
 * @param duration duration for the toast to stay visible.
 */
function showToastWithPromise(message: string, type: ToastType, duration: number = 8000): Promise<void> {
    return new Promise((resolve, reject) => {
        Vue.$toast.open({
            message: message,
            type: type,
            duration: duration,
            onDismiss: () => {
                resolve();
            }
        })
    });
}

export { debounce, showToast, showToastWithPromise };