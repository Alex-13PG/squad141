const { remote } = require('webdriverio');

describe('Calculadora Google - Lista 11', () => {
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
        await driver.deleteSession();
    });

    async function clearCalculator() {
        const clearButton = await driver.$("accessibility id:clear");
        await clearButton.click();
    }

    it('Adição de 14 + 21', async () => {
        await clearCalculator();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:4")).click();
        await (await driver.$("accessibility id:plus")).click();
        await (await driver.$("accessibility id:2")).click();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:equals")).click();

        const result = await driver.$("id:com.google.android.calculator:id/result_final");
        const resultText = await result.getText();
        console.log(`Resultado da adição 14 + 21: ${resultText.trim()}`);

        if (resultText.trim() !== '35') {
            throw new Error(`Resultado incorreto: esperado '35', mas obteve '${resultText.trim()}'`);
        }
    });

    it('Subtração de 19 - 11', async () => {
        await clearCalculator();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:9")).click();
        await (await driver.$("accessibility id:minus")).click();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:equals")).click();

        const result = await driver.$("id:com.google.android.calculator:id/result_final");
        const resultText = await result.getText();
        console.log(`Resultado da subtração 19 - 11: ${resultText.trim()}`);

        if (resultText.trim() !== '8') {
            throw new Error(`Resultado incorreto: esperado '8', mas obteve '${resultText.trim()}'`);
        }
    });

    it('Multiplicação de 33 * 12', async () => {
        await clearCalculator();
        await (await driver.$("accessibility id:3")).click();
        await (await driver.$("accessibility id:3")).click();
        await (await driver.$("accessibility id:multiply")).click();
        await (await driver.$("accessibility id:1")).click();
        await (await driver.$("accessibility id:2")).click();
        await (await driver.$("accessibility id:equals")).click();

        const result = await driver.$("id:com.google.android.calculator:id/result_final");
        const resultText = await result.getText();
        console.log(`Resultado da multiplicação 33 * 12: ${resultText.trim()}`);

        if (resultText.trim() !== '396') {
            throw new Error(`Resultado incorreto: esperado '396', mas obteve '${resultText.trim()}'`);
        }
    });

    it('Divisão de 99 / 33', async () => {
        await clearCalculator();
        await (await driver.$("accessibility id:9")).click();
        await (await driver.$("accessibility id:9")).click();
        await (await driver.$("accessibility id:divide")).click();
        await (await driver.$("accessibility id:3")).click();
        await (await driver.$("accessibility id:3")).click();
        await (await driver.$("accessibility id:equals")).click();

        const result = await driver.$("id:com.google.android.calculator:id/result_final");
        const resultText = await result.getText();
        console.log(`Resultado da divisão 99 / 33: ${resultText.trim()}`);

        if (resultText.trim() !== '3') {
            throw new Error(`Resultado incorreto: esperado '3', mas obteve '${resultText.trim()}'`);
        }
        await clearCalculator();
    });
});
