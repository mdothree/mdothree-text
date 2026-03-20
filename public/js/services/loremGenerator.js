// loremGenerator.js

const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor',
  'incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud',
  'exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure',
  'in','reprehenderit','voluptate','velit','esse','cillum','eu','fugiat','nulla','pariatur','excepteur',
  'sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim',
  'id','est','laborum','perspiciatis','unde','omnis','iste','natus','error','accusantium','doloremque',
  'laudantium','totam','rem','aperiam','eaque','ipsa','quae','ab','illo','inventore','veritatis','quasi',
  'architecto','beatae','vitae','dicta','explicabo','nemo','ipsam','quia','voluptas','aspernatur','aut',
  'odit','fugit','sed','quia','consequuntur','magni','dolores','eos','ratione','sequi','nesciunt','neque',
  'porro','quisquam','dolorem','adipisci','velit','numquam','eius','modi','tempora','incidunt','labore'
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function randomSentence(wordCount = null) {
  const count = wordCount || Math.floor(Math.random() * 12) + 6;
  const words = Array.from({ length: count }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function randomParagraph(sentenceCount = null) {
  const count = sentenceCount || Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: count }, () => randomSentence()).join(' ');
}

export function generateLorem(unit, amount, options = {}) {
  const { startLorem = true, htmlWrapped = false } = options;
  let result = '';

  if (unit === 'paragraphs') {
    const paragraphs = Array.from({ length: amount }, (_, i) => {
      if (i === 0 && startLorem) return LOREM_START + ' ' + randomParagraph(2);
      return randomParagraph();
    });
    if (htmlWrapped) {
      result = paragraphs.map(p => `<p>${p}</p>`).join('\n');
    } else {
      result = paragraphs.join('\n\n');
    }
  } else if (unit === 'sentences') {
    const sentences = Array.from({ length: amount }, (_, i) => {
      if (i === 0 && startLorem) return LOREM_START;
      return randomSentence();
    });
    result = sentences.join(' ');
  } else if (unit === 'words') {
    const words = [];
    if (startLorem) {
      const loremWords = LOREM_START.replace(/[.,]/g, '').toLowerCase().split(' ');
      words.push(...loremWords.slice(0, Math.min(amount, loremWords.length)));
    }
    while (words.length < amount) words.push(randomWord());
    result = words.slice(0, amount).join(' ');
  } else if (unit === 'bytes') {
    // Generate approximately `amount` bytes of text
    let text = startLorem ? LOREM_START + ' ' : '';
    while (text.length < amount) {
      text += randomParagraph() + '\n\n';
    }
    result = text.slice(0, amount);
  }

  return result;
}
