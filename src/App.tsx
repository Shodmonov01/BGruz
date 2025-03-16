import { OrderContextProvider } from './context/order-context'
import AppProvider from './providers'
import AppRouter from './routes'

export default function App() {
    return (
        <AppProvider>
            <OrderContextProvider>
                <AppRouter />
            </OrderContextProvider> 
        </AppProvider>
    )
}
