import { useEffect, useState } from "react";

export default function timer({endTime, setHideTimer, small}) {
    const [days, setDays] = useState('00')
    const [hours, setHours] = useState('00')
    const [minutes, setMinutes] = useState('00')
    const [seconds, setSeconds] = useState('00')

    function calcTime() {
        const diff = endTime - Date.now()
        if (diff < 1000) {
            if (!small) {
                if (endTime === 0) {
                    return
                }
                setHideTimer(true)
                window.location.reload()
            } else {
                if (endTime === 0) {
                    return
                }
                setHideTimer(false)
                window.location.reload()
            }
        }

        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'))
        setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'))
        setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'))
        setSeconds(Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0'))
    }

    useEffect(() => {
        const interval = setInterval(calcTime, 1000)
        return () => clearInterval(interval)
    })

    if (endTime === 0) {
        return (
            <h1>Balsošana ir noslēgusies!</h1>
        )
    } else if (!small) {
        return (
            <h1>{days}d {hours}h {minutes}m {seconds}s</h1>
        )
    } else {
        return (
            <h5>{days}d {hours}h {minutes}m {seconds}s</h5>
        )
    }
}