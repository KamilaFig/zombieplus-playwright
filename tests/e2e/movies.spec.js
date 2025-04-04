import { test, expect } from '../support'

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test('Should register a new movie', async ({ page }) => {
    const movie = data.create
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await page.login.visit()
    await page.login.submitForm('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)
    await page.toast.containText('Cadastro realizado com sucesso!')
});

test('Should not register movie when the required fields are empty', async ({ page }) => {
    await page.login.visit()
    await page.login.submitForm('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ])
})
