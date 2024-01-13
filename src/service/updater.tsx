import { ToastContainer } from "react-toastify";

// @ts-ignore
export function updater<T>(Component: React.ComponentType<any>) {
    return function (props: any) {
        return (
            <>
                <Component {...props} />
                <ToastContainer autoClose={3000} />
            </>
        );
    };
}
