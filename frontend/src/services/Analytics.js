export const GA_TRACKING_ID = 'G-V22Y5T3YT6'

// Initialize Google Analytics
export const initGA = () => {
    if (window.gtag) return;
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
        window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID)

    window.gtag = gtag
    console.log(`End GA init`);
}

// Track page views
export const pageView = (path) => {
    if (window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: path,
        })
    }
}

// Track custom events
export const event = ({ action, category, label, value }) => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}