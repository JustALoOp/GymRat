from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Register
    page.goto("http://localhost:8080/register")
    page.get_by_label("Username").fill("testuser")
    page.get_by_label("Email Address").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Register").click()

    # Login
    expect(page).to_have_url("http://localhost:8080/login")
    page.get_by_label("Email Address").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()

    # Dashboard
    expect(page).to_have_url("http://localhost:8080/dashboard")
    expect(page.get_by_-role("heading", name="Welcome to your Dashboard")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)