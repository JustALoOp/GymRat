import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API response
    def handle_route(route):
        if "api/v1/auth/me" in route.request.url:
            route.fulfill(status=200, json={
                "success": True,
                "data": {"_id": "1", "name": "Test User", "email": "test@example.com"}
            })
        else:
            route.continue_()

    page.route("**/*", handle_route)

    # Symulacja zalogowania
    page.goto("http://localhost:5173/")
    page.wait_for_load_state("networkidle")
    page.evaluate("localStorage.setItem('token', 'fake-token-for-verification')")

    # Przejdź do strony profilu i zrób zrzut ekranu
    page.goto("http://localhost:5173/profile")
    page.wait_for_selector('h4:has-text("Your Profile")')
    page.screenshot(path="jules-scratch/verification/profile_page.png")

    # Zamknij przeglądarkę
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)