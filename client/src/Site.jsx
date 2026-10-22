// This file decides which page to show: the home page or the DocuMind app.
// It looks at the end of the web address:
//   http://localhost:5173/        -> home page
//   http://localhost:5173/#/app   -> the app

import { useState, useEffect } from "react"
import LandingPage from "./components/LandingPage"
import App from "./App"

// This returns "app" if the address ends with #/app, otherwise "home"
function getPageFromAddress() {
    if (window.location.hash === "#/app") {
        return "app"
    }
    return "home"
}

function Site() {
    const [page, setPage] = useState(getPageFromAddress())

    // When the address changes (button click or browser back button), update the page
    useEffect(function () {
        function handleAddressChange() {
            setPage(getPageFromAddress())
        }

        window.addEventListener("hashchange", handleAddressChange)

        return function () {
            window.removeEventListener("hashchange", handleAddressChange)
        }
    }, [])

    if (page === "app") {
        return <App />
    }

    return <LandingPage />
}

export default Site