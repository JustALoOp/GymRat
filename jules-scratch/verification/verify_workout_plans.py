from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    console_messages = []
    page.on("console", lambda msg: console_messages.append(msg.text))

    try:
        # Logowanie
        page.goto("http://localhost:5173/login")
        expect(page).to_have_url("http://localhost:5173/login")
        page.get_by_label("Email Address").fill("test@example.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Sign In").click()

        # Oczekiwanie na załadowanie dashboardu
        expect(page).to_have_url("http://localhost:5173/dashboard", timeout=10000)

        # Nawigacja do strony z planami treningowymi
        page.get_by_role("link", name="Workout Plans").click()
        expect(page).to_have_url("http://localhost:5173/workout-plans")

        # Sprawdzenie, czy strona zawiera oczekiwane elementy
        expect(page.get_by_role("heading", name="Workout Plans")).to_be_visible()
        expect(page.get_by_role("button", name="Create New Plan")).to_be_visible()

        # Zrobienie zrzutu ekranu
        page.screenshot(path="jules-scratch/verification/workout_plans_page.png")

    finally:
        print("Console messages:", console_messages)
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)