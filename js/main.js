// Проверяем доступность всех компонентов
const components = [
  'components/header.html',
  'components/about_course.html', 
  'components/materials.html',
  'components/tariffs.html',
  'components/faq.html',
  'components/footer.html'
];

console.log('Проверка доступности компонентов:');

components.forEach(file => {
  fetch(file)
    .then(response => {
      console.log(`✓ ${file}: ${response.status} ${response.ok ? 'OK' : 'ERROR'}`);
    })
    .catch(error => {
      console.log(`✗ ${file}: ${error.message}`);
    });
});