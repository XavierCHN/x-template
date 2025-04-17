import React from 'react';

export function useInterval(callback: () => void, delay: number) {
    const interval = React.useRef<number>();

    React.useEffect(() => {
        interval.current = setInterval(callback, delay);
        return () => clearInterval(interval.current);
    }, [callback, delay]);
}
