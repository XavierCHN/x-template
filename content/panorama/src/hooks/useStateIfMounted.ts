import type { Dispatch, SetStateAction } from 'react';
import { useState, useCallback } from 'react';
import useIsComponentMounted from './useIsComponnetMounted';

/**
 * Like React's [useState](https://reactjs.org/docs/hooks-reference.html#usestate)
 * but it makes sure the component that uses this hook is mounted when updating state
 *
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 * @export
 * @param {any} initialValue
 * @returns {[any, Diapatch<any>]} an array of 2 items
 * the first is the current state, the second is a state update function
 * that does nothing if the component is not mounted
 */
export default function useStateIfMounted<S>(initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    const isComponentMounted = useIsComponentMounted();
    const [state, setState] = useState(initialValue);
    const newSetState = useCallback(
        value => {
            if (isComponentMounted.current) {
                setState(value);
            }
        },
        [isComponentMounted]
    );
    return [state, newSetState];
}
