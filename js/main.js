// Тест 1: Пробуем разные варианты путей
const testPaths = [
  'components/header.html',
  '/components/header.html',
  '/Drawing_school/components/header.html',
  './components/header.html'
];

testPaths.forEach(path => {
  fetch(path)
    .then(r => console.log(`Путь "${path}": ${r.status}`))
    .catch(e => console.log(`Путь "${path}": Ошибка`));
});