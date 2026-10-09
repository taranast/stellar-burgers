import { test, expect } from '@playwright/test';

const bunName = "Краторная булка N-200i";
const ingredientName = "Биокотлета из марсианской Магнолии"
const nutrition = {
  calories: '420',
  proteins: '80',
  fat: '24',
  carbohydrates: '53'
}
const bunPrice = 1255;
const ingredientPrice = 424;

test.describe('Constructor tests', () => {
  test.beforeEach(async ({page}) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });
    await page.goto('/');
  })

  test('show ingredients', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    await expect(ingredients.first()).toBeVisible();
    await expect(ingredients).toHaveCount(15);
  })

  test('add bun', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({ hasText: /булка/i}).first();
    await bun.getByRole('button', {name: 'Добавить'}).click();
    const bunTop = page.getByTestId('bun-top');
    const bunBottom = page.getByTestId('bun-bottom');
    await expect(bunTop).toContainText(bunName);
    await expect(bunBottom).toContainText(bunName);
  })

  test('add ingredient', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const constructorElement = page.getByTestId('burger-constructor-element');
    await expect(constructorElement).toHaveCount(0);
    const addIngredient = ingredients.filter({hasText: /котлета/i}).first();
    await addIngredient.getByRole('button', {name: 'Добавить'}).click();
    await expect(constructorElement).toHaveCount(1);
    await expect(constructorElement.filter({hasText: /котлета/i})).toHaveCount(1);
  })

  test('show price test', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({ hasText: /булка/i}).first();
    await bun.getByRole('button', {name: 'Добавить'}).click();
    const addIngredient = ingredients.filter({hasText: /котлета/i}).first();
    await addIngredient.getByRole('button', {name: 'Добавить'}).click();
    const price = bunPrice * 2 + ingredientPrice;
    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toHaveText(String(price))
  })

  test('show modal', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({ hasText: /булка/i}).first();
    await bun.click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(bunName);
    await expect(modal).toContainText(nutrition.calories);
    await expect(modal).toContainText(nutrition.proteins);
    await expect(modal).toContainText(nutrition.fat);
    await expect(modal).toContainText(nutrition.carbohydrates);
  })

  test('close modal', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({ hasText: /булка/i}).first();
    await bun.click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    const closeButton = page.getByTestId('modal-close');
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  })

  test('close modal on overlay', async ({page}) => {
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({ hasText: /булка/i}).first();
    await bun.click();
    const modal = page.getByTestId('modal');
    const modalOverlay = page.getByTestId('modal-overlay');
    await modalOverlay.click({position: {x: 0, y: 0}});
    await expect(modal).not.toBeVisible()
  })

  test('make order', async ({page}) => {
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user'
    });
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders'
    });
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.goto('/');
    const ingredients = page.getByTestId('burger-ingredient');
    const bun = ingredients.filter({hasText: bunName}).first();
    await bun.getByRole('button', {name: 'Добавить'}).click();
    const ingredient = ingredients.filter({hasText: ingredientName}).first();
    await ingredient.getByRole('button', {name: 'Добавить'}).click();
    const orderButton = page.getByRole('button', {name: 'Оформить заказ'});
    await expect(orderButton).toBeEnabled();
    await orderButton.click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    const orderNumber = page.getByTestId('order-number');
    await expect(orderNumber).toHaveText('1234');
    const closeButton = page.getByTestId('modal-close');
    await closeButton.click();
    await expect(modal).not.toBeVisible();
    const burgerConstructor = page.getByTestId('burger-constructor');
    const noBuns = burgerConstructor.getByTestId('no-buns')
    const noIngredients = burgerConstructor.getByTestId('no-ingredients');
    await expect(noBuns).toHaveCount(2);
    await expect(noBuns.first()).toBeVisible();
    await expect(noIngredients).toBeVisible();
  })
})