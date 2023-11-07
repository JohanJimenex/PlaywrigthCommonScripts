// @ts-check
import { test, expect } from "@playwright/test";

const urlApp = "https://opensource-demo.orangehrmlive.com";
const user = "Admin";
const password = "admin123";

async function initAppWithCredentials(
  page,
  userParam = user,
  passParam = password
) {
  await page.goto(urlApp);
  await page.getByPlaceholder("Username").fill(userParam);
  await page.getByPlaceholder("Password").fill(passParam);
  await page.getByRole("button", { name: "Login" }).click();
}

test.describe("Log In Page Tests", () => {
  //Este metodo sirve para ejecuta codigo antes de ejecutar cada una de las pruebas para evitar
  //   test.beforeEach(async ({ page }) => {
  // await initAppWithCredentials(page);
  //   });

  test("Sign In with valid credentials", async ({ page }) => {
    await initAppWithCredentials(page);
    // const elementToValidate = page.getByRole("heading", { name: "Dashboard" });
    const elementToValidate = page.locator('//h6[text()="Dashboard"]');
    await expect(elementToValidate).toBeVisible();
  });

  test("Sign in with wrong credentials", async ({ page }) => {
    const userList = ["userWrong", user, "klk"];
    const passworList = ["wrongUser", "klk", password];

    //Reutilizando codigo en bucle for para tener menos lineas de codigo
    for (let index = 0; index < userList.length; index++) {
      await initAppWithCredentials(page, userList[index], passworList[index]);
      const elementToValidate2 = page.getByText("Invalid credentials");
      await expect(elementToValidate2).toBeVisible();
    }
  });

  test("Sign in with empty username", async ({ page }) => {
    await initAppWithCredentials(page, "", password);
    const elementToValidate = page.getByText("Required");
    await expect(elementToValidate).toBeVisible();
  });

  test("Sign in with empty password", async ({ page }) => {
    await initAppWithCredentials(page, user, "");
    const elementToValidate = await page.getByText("Required");
    await expect(elementToValidate).toBeVisible();
  });

  test("Try the link 'Forgot your password?'", async ({ page }) => {
    await page.goto(urlApp);
    await page.getByText("Forgot your password?").click();
    const elementToValidate = page.getByRole("heading", {
      name: "Reset Password",
    });
    await expect(elementToValidate).toBeVisible();
  });

  test("Try the link 'OrangeHRM, Inc'", async ({ page }) => {
    await page.goto(urlApp);
    await page.getByRole("link", { name: "OrangeHRM, Inc" }).click();
    //Con este codigo guardamos la segunda pagina que se abra por click o nueva pestaña
    const newPage = await page.context().waitForEvent("page");
    const elementToValidate = newPage.getByRole("heading", {
      name: "Peace of mind is just a few clicks away!",
    });
    await expect(elementToValidate).toBeVisible();
  });
});

export { initAppWithCredentials };
