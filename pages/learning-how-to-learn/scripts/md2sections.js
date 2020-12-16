const marked = require('marked');
const fs = require('fs');

const substrFromFirstSection = (str = "") =>
    (`${str.substr(str.indexOf("<section>"))}</section></section>`);

marked.setOptions({ headerIds: false })

const readMe = fs.readFileSync('README.md', 'utf-8');

const renderer = {
    heading(text, level) {
        switch (level) {
            case 1:
                return "";
            case 2:
                return `
                    </section>
                </section>
                <section>                
                    <section>
                        <h${level}>
                            ${text}
                        </h${level}>`
            case 3:
            case 4:
                return `
                    </section>
                    <section>
                        <h${level}>
                            ${text}
                        </h${level}>`
            default:
                return `
                    <h${level}>
                        ${text}
                    </h${level}>
                    `
        }
    }
}

marked.use({ renderer, });


const sections = substrFromFirstSection(marked(readMe));

fs.writeFileSync('generated/sections.js', `export const sections = \`${sections}\`;`);

