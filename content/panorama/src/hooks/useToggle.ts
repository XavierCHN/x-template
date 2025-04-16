import { useCallback, useState } from 'react';

export default function useToggle(initial = false): [boolean, () => void, (value: boolean) => void] {
    const [value, setValue] = useState<boolean>(initial);
    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);
    return [value, toggle, setValue];
}
