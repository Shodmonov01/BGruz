import { Provider } from 'react-redux';
import AppProvider from './providers'
import AppRouter from './routes'
import store from './store/store'
import ThemeProvider from './providers/theme-provider'

export default function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AppProvider>
                    <AppRouter />
                </AppProvider>
            </ThemeProvider>
        </Provider>
    )
}
