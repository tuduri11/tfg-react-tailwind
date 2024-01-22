import { useRef, useEffect} from "react";
const useEffectWithoutFirstRun = (effect, deps) => {
    const isFirstRun = useRef(true);
    useEffect (() => {
        if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
        }
        return effect();
    }, deps);
}

export default useEffectWithoutFirstRun