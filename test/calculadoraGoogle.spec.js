const { remote } = require('webdriverio')
const divisaoMassa = require('../vendors/massaDivisão')
const fatorialMassa = require('../vendors/massaFatorial')

describe('Calculadora App - Operações Matemáticas', () => {
    let driver;

    const caps = {
        "platformName": "Android",
        "appium:platformVersion": "9.0",
        "appium:deviceName": "emulator-5554",
        "appium:automationName": "UIAutomator2",
        "appium:appActivity": "com.android.calculator2.Calculator",
        "appium:newCommandTimeout": 240,
        "appium:ensureWebviewsHavePages": true,
        "appium:nativeWebScreenshot": true,
        "appium:connectHardwareKeyboard": true
    };

    before(async () => {
        driver = await remote({
            protocol: "http",
            hostname: "127.0.0.1",
            port: 4723,
            path: "/",
            capabilities: caps
        });
    });

    after(async () => {
        await driver.deleteSession()
    });

    async function clearCalculator() {
        const clearButton = await driver.$("accessibility id:clear")
        await clearButton.click()
    }

    it('Deve dividir 99 por 3 e obter o resultado', async () => {
        await clearCalculator()
        await (await driver.$("accessibility id:9")).click()
        await (await driver.$("accessibility id:9")).click()
        await (await driver.$("accessibility id:divide")).click()
        await (await driver.$("accessibility id:3")).click()
        await (await driver.$("accessibility id:equals")).click()
        const result = await driver.$("id:com.google.android.calculator:id/result_final")
        await result.click()
    })

    it('Deve calcular o fatorial de 5', async () => {
        await clearCalculator()
        await (await driver.$("accessibility id:5")).click()
        await (await driver.$("accessibility id:factorial")).click()
        await (await driver.$("accessibility id:equals")).click()
        const result = await driver.$("id:com.google.android.calculator:id/result_final")
        await result.click()
    })


    divisaoMassa.array.forEach(({ num1, num2, num3, esperado }) => {
        it(`Deve dividir ${num1}${num2} por ${num3} e obter o resultado esperado: ${esperado}`, async () => {
            await clearCalculator()

            // Digitar o primeiro número
            for (const digit of num1.toString()) {
                await (await driver.$(`accessibility id:${digit}`)).click()
            }
            // Digitar o segundo número
            for (const digit of num2.toString()) {
                await (await driver.$(`accessibility id:${digit}`)).click()
            }
            // Digitar o operador de divisão
            await (await driver.$("accessibility id:divide")).click()


            // Digitar o 4 número
            for (const digit of num3.toString()) {
                await (await driver.$(`accessibility id:${digit}`)).click()
            }

            // Pressionar igual
            await (await driver.$("accessibility id:equals")).click()

            // Capturar e validar o resultado
            const result = await driver.$("id:com.google.android.calculator:id/result_final")

            // Aguarda o resultado ficar visível
            await result.waitForDisplayed()

            // Captura o texto do resultado
            const resultText = await result.getText()
            console.log(`Resultado capturado: '${resultText}'`); // Adiciona log para depuração

            // Compara o resultado
            if (resultText.trim() !== esperado) {
                throw new Error(`Resultado incorreto: esperado '${esperado}', mas obteve '${resultText.trim()}'`)
            }
        })
    });

    
    fatorialMassa.array.forEach(({ num, esperado }) => {
        it(`Deve calcular o fatorial de ${num} e obter o resultado esperado: ${esperado}`, async () => {
            await clearCalculator()

            // Digitar o número
            await (await driver.$(`accessibility id:${num}`)).click()
            // Clicar na operação de fatorial
            await (await driver.$("accessibility id:factorial")).click()
            // Pressionar igual
            await (await driver.$("accessibility id:equals")).click()

            // Capturar e validar o resultado
            const result = await driver.$("id:com.google.android.calculator:id/result_final");
            const resultText = await result.getText();
            if (resultText.trim() !== String(esperado)) {
                throw new Error(`Resultado incorreto: esperado '${esperado}', mas obteve '${resultText.trim()}'`);
            }
        });
    });
});

