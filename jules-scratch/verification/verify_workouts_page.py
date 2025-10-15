from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Logowanie
        page.goto("http://localhost:5173/login")
        page.get_by_label("Email").fill("test@test.com")
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Login").click()

        # Oczekiwanie na przejście do dashboardu
        expect(page).to_have_url("http://localhost:5173/dashboard")

        # Przejście do strony z treningami
        page.goto("http://localhost:5173/workouts")

        # Oczekiwanie na załadowanie treningów
        expect(page.get_by_text("Your Workouts")).to_be_visible()

        # Zrobienie zrzutu ekranu
        page.screenshot(path="jules-scratch/verification/workouts_page.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)