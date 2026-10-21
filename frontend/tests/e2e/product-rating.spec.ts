import { test, expect } from '@playwright/test';

test.describe('Product star ratings', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/products', (route) => route.fulfill({
      json: [
        { productId: 1, name: 'SmartFeeder One', description: 'Smart feeder', price: 50, imgName: 'feeder.png' },
        { productId: 2, name: 'Cat Camera', description: 'Smart camera', price: 80, imgName: 'camera.png' },
      ],
    }));
    await page.goto('/products');
  });

  test('select, change, and persist independent ratings across searches and reloads', async ({ page }) => {
    const feeder = page.getByRole('button', { name: 'Rate SmartFeeder One 4 out of 5 stars', exact: true });
    const camera = page.getByRole('button', { name: 'Rate Cat Camera 2 out of 5 stars', exact: true });
    await expect(page.getByRole('button', { name: /^Rate .* out of 5 stars$/ })).toHaveCount(10);
    await expect(feeder).toHaveCSS('background-color', 'rgb(220, 38, 38)');
    await expect(feeder).toHaveAttribute('aria-pressed', 'false');
    await feeder.click();
    await expect(feeder).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Your rating: 4/5', { exact: false })).toBeVisible();
    await expect(camera).toHaveAttribute('aria-pressed', 'false');
    await camera.click();

    const search = page.getByRole('textbox', { name: 'Search products' });
    await search.fill('Camera');
    await expect(feeder).toHaveCount(0);
    await search.fill('');
    await expect(feeder).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(feeder).toHaveAttribute('aria-pressed', 'true');
    await expect(camera).toHaveAttribute('aria-pressed', 'true');

    const fiveStars = page.getByRole('button', { name: 'Rate SmartFeeder One 5 out of 5 stars', exact: true });
    await fiveStars.focus();
    await page.keyboard.press('Enter');
    await expect(fiveStars).toHaveAttribute('aria-pressed', 'true');
    await expect(feeder).toHaveAttribute('aria-pressed', 'false');
    await feeder.focus();
    await page.keyboard.press('Space');
    await expect(feeder).toHaveAttribute('aria-pressed', 'true');
  });

  test('ignores invalid stored ratings and handles unavailable storage', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('product-rating:1', '6'));
    await page.reload();
    const stars = page.getByRole('button', { name: /^Rate SmartFeeder One/ });
    await expect(stars).toHaveCount(5);
    for (const star of await stars.all()) {
      await expect(star).toHaveAttribute('aria-pressed', 'false');
    }
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() { throw new Error('Storage unavailable'); },
      });
    });
    await page.reload();
    const rating = page.getByRole('button', { name: 'Rate SmartFeeder One 3 out of 5 stars', exact: true });
    await rating.click();
    await expect(rating).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Could not save in this browser. Your rating is temporary.')).toBeVisible();
  });

  test('keeps large red buttons within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const stars = page.getByRole('button', { name: /^Rate SmartFeeder One/ });
    await expect(stars).toHaveCount(5);
    for (const star of await stars.all()) {
      const box = await star.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(375);
      }
    }
  });
});
