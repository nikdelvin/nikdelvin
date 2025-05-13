const config = {
    printWidth: 120,
    singleQuote: true,
    tabWidth: 4,
    semi: false,
    singleAttributePerLine: true,
    trailingComma: 'none',
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro'
            }
        }
    ]
}

export default config
