// Dashboard redirect check
(function() {
    console.log("Dashboard check script running");
    // Check if the current URL is the dashboard URL
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/care-connector/webapp/dashboard')) {
        console.log("Detected dashboard path, redirecting to direct dashboard page");
        // Store that we're coming from a dashboard redirect to prevent loops
        sessionStorage.setItem('dashboard_redirect', 'true');
        
        // Check if we're already in a redirect loop
        if (sessionStorage.getItem('dashboard_redirect_attempts') > 3) {
            console.error("Too many redirect attempts, stopping");
            document.body.innerHTML = `
                <div style="padding: 2rem; text-align: center; max-width: 600px; margin: 0 auto;">
                    <h1>Dashboard Redirect Error</h1>
                    <p>We're having trouble loading the dashboard. Please try one of these options:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 1rem;">
                            <a href="/dashboard.html" style="display: inline-block; padding: 0.5rem 1rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 0.25rem;">
                                Access Dashboard Directly
                            </a>
                        </li>
                        <li>
                            <a href="/care-connector" style="display: inline-block; padding: 0.5rem 1rem; background: #e5e7eb; color: #1f2937; text-decoration: none; border-radius: 0.25rem;">
                                Return to Home Page
                            </a>
                        </li>
                    </ul>
                </div>
            `;
            return;
        }
        
        // Increment redirect attempts
        const attempts = parseInt(sessionStorage.getItem('dashboard_redirect_attempts') || '0');
        sessionStorage.setItem('dashboard_redirect_attempts', attempts + 1);
        
        // Redirect to the dashboard.html page
        window.location.href = '/dashboard.html';
    }
})(); 