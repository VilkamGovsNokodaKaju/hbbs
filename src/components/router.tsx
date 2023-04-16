import Admin from "../routes/admin";
import Root from "../routes/root";

export default function Router({url}) {
    if (url === '/') {
        return (
            <Root />
        )
    } else if (url === '/admin') {
        return (
            <Admin />
        )
    }
}