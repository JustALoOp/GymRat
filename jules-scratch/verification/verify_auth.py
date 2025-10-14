from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to registration page
    page.goto("http://localhost:5173/register")
    page.screenshot(path="jules-scratch/verification/register_page.png")

    # Fill out registration form
    page.get_by_label("Username").fill("testuser")
    page.get_by_label("Email Address").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Register").click()

    # Go to login page
    page.wait_for_url("http://localhost:5173/login")
    page.screenshot(path="jules-scratch/verification/login_page.png")

    # Fill out login form
    page.get_by_label("Email Address").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()

    # Wait for navigation to dashboard
    page.wait_for_url("http://localhost:5173/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)