import React from 'react';

export function useInterval(callback: () => void, delay: number) {
    React.useEffect(() => {
        const interval = setInterval(() => {
            callback();
        }, delay);

        return () => {
            clearInterval(interval);
        };
    });
}

export function useTimeout(callback: () => void, delay: number) {
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    });
}
