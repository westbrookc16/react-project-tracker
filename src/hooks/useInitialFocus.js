import { useEffect } from 'react';
const useInitialfocus = (ref, title) => {
	useEffect(() => {
		ref.current.focus();
		document.title = title;
	}, [ref, title]);
};
export default useInitialfocus;
