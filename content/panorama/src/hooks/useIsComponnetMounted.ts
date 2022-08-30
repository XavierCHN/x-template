import { useEffect, useRef } from 'react';

export default function useIsComponentMounted() {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    return isMounted;
}
