const { test: base, expect } = require('@playwright/test')

const { LandingPage } = require('../pages/LandingPage')
const { LoginPage } = require('../pages/LoginPage')
const { Toast } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')

const test = base.extend({
    page: async ({ page }, use) => {

        const context = page

        context['landing'] = new LandingPage(page)
        context['login'] = new LoginPage(page)
        context['toast'] = new Toast(page)
        context['movies'] = new MoviesPage(page)

        await use(context)
    }
})

export { test, expect }
