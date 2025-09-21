import { AlertsProvider } from '../service/AlertsProvider'
import { NotificationProvider } from '../service/NotificationProvider'
import QueryContext from './QueryContext'
import RouterContext from './RouterContext'
import SSEProvider from './SSEContext'
import ThemeContext from './ThemeContext'
import WebSocketProvider from './WebSocketContext'

const Contexts = ({ children }) => {
  const contexts = [
    AlertsProvider,
    ThemeContext,
    QueryContext,
    NotificationProvider,
    SSEProvider,
    WebSocketProvider,
    RouterContext,
  ]

  return contexts.reduceRight((acc, Context) => {
    return <Context>{acc}</Context>
  }, children)
}

export default Contexts
