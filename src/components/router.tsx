import Admin from "../routes/admin";
import Root from "../routes/root";

export default function Router({url, params}) {
    if (url === '/') {
        return (
            <Root codeParam={params.get("code")} />
        )
    } else if (url === '/admin') {
        return (
            <Admin />
        )
    }
}