import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux";
import store from "./redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CookiesProvider>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </Provider>
        </CookiesProvider>
    </React.StrictMode>,
)
