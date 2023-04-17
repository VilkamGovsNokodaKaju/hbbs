import ChartsEmbedSDK, { getRealmUserToken } from '@mongodb-js/charts-embed-dom';
import '../style/dash.css'
import { useEffect } from 'react';

export default function ChartDashboard({app}) {
    useEffect(() => {
        const chartsSDK = new ChartsEmbedSDK({
            baseUrl: 'https://charts.mongodb.com/charts-hbbs-oxarr',
            getUserToken: () => getRealmUserToken(app)
        })
    
        const dashboard = chartsSDK.createDashboard({
            dashboardId: '8546ec67-27e1-4684-8b8f-f55049947d61',
        })
    
        dashboard
            .render(document.getElementById('chartDiv'))
            .catch((error) => {
                console.error(error)
                window.alert('Failed to render dashboard')
            })
    }, [app])

    return (
        <div id='chartDiv'></div>
    )
}