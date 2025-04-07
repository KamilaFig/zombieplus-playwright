import { test, expect } from '../support'

test('Should log in as an admin', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('admin@zombieplus.com', 'pwd123')
    await page.login.isLoggedIn()
});

test('Should not log in as an admin with invalid password', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('admin@zombieplus.com', 'abc123')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.containText(message)
});

test('Should not log in as an admin with invalid email', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('adminzombieplus.com', 'pwd123')
    await page.login.alertHaveText('Email incorreto')
});

test('Should not log in as an admin when the email field is empty', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('', 'pwd123')
    await page.login.alertHaveText('Campo obrigatório')
});

test('Should not log in as an admin when the password field is empty', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('admin@zombieplus.com', '')
    await page.login.alertHaveText('Campo obrigatório')
});

test('Should not log in as an admin when the form is empty', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('', '')
    await page.login.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório'
    ])
});
