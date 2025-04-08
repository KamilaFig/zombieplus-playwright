import { test, expect } from '../support'

const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test('Should register a new movie', async ({ page }) => {
    await executeSQL(`DELETE FROM movies`)

    const movie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123','Admin')
    await page.movies.create(movie)
    await page.toast.containText('UhullCadastro realizado com sucesso!')
});

test('Should not register movie when the required fields are empty', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()

    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ]);
})
