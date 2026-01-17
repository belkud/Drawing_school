// js/main.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
$(document).ready(function() {
  console.log('Сайт загружен - обработчик ready работает');
  
  // Простая проверка - если видно в консоли, значит JS работает
  $('#app').append('<p style="color: red; padding: 20px; border: 2px solid red;">JavaScript работает! Этот текст добавлен через JS</p>');
  
  // ТЕСТ: Проверяем доступность компонентов
  console.log('=== Начинаем проверку компонентов ===');
  console.log('Текущий URL:', window.location.href);
  
  // Сначала проверяем, доступны ли файлы компонентов
  const testPaths = [
    '/Drawing_school/components/header.html',
    'components/header.html',
    './components/header.html'
  ];
  
  let pathFound = null;
  
  // Функция для проверки пути
  function testPath(path) {
    return fetch(path)
      .then(response => {
        console.log(`Проверка пути "${path}": статус ${response.status}`);
        if (response.ok) {
          console.log(`✓ Найден рабочий путь: ${path}`);
          return path;
        }
        return null;
      })
      .catch(error => {
        console.log(`✗ Ошибка для пути "${path}":`, error.message);
        return null;
      });
  }
  
  // Проверяем все пути последовательно
  async function findWorkingPath() {
    for (const path of testPaths) {
      const result = await testPath(path);
      if (result) {
        pathFound = result;
        break;
      }
    }
    
    if (!pathFound) {
      console.error('❌ Ни один путь к компонентам не работает!');
      $('#app').append('<div class="alert alert-danger" style="margin: 20px;">Ошибка: компоненты недоступны. Проверьте папку components/ на GitHub</div>');
      return;
    }
    
    console.log('Используем путь:', pathFound);
    
    // Загружаем компоненты с рабочим путем
    const basePath = pathFound.includes('/Drawing_school/') 
      ? '/Drawing_school/components/' 
      : 'components/';
    
    const components = [
      { id: 'header', file: basePath + 'header.html' },
      { id: 'about_course', file: basePath + 'about_course.html' },
      { id: 'materials', file: basePath + 'materials.html' },
      { id: 'tariffs', file: basePath + 'tariffs.html' },
      { id: 'faq', file: basePath + 'faq.html' },
      { id: 'footer', file: basePath + 'footer.html' }
    ];
    
    console.log('Начинаю загрузку компонентов...');
    
    let loadedCount = 0;
    let hasErrors = false;
    
    components.forEach(component => {
      console.log(`Пробую загрузить: ${component.file}`);
      
      $(`#${component.id}`).load(component.file, function(response, status, xhr) {
        loadedCount++;
        
        if (status === "error") {
          console.error(`❌ Ошибка загрузки ${component.file}:`, xhr.status, xhr.statusText);
          $(`#${component.id}`).html(
            `<div class="alert alert-warning">
              <strong>Внимание:</strong> Компонент "${component.id}" не загружен.<br>
              Файл: ${component.file}<br>
              Статус: ${xhr.status} ${xhr.statusText}
            </div>`
          );
          hasErrors = true;
        } else {
          console.log(`✓ Успешно: ${component.file}`);
        }
        
        if (loadedCount === components.length) {
          console.log('=== Все компоненты обработаны ===');
          if (hasErrors) {
            console.error('Есть ошибки загрузки компонентов');
            $('#app').append('<div class="alert alert-warning">Некоторые компоненты не загрузились. Проверьте консоль.</div>');
          } else {
            console.log('Все компоненты загружены успешно');
            initApp();
          }
        }
      });
    });
  }
  
  // Запускаем поиск рабочего пути
  findWorkingPath();
  
  // ===== ФУНКЦИИ ПРИЛОЖЕНИЯ =====
  
  function initApp() {
    console.log('Инициализация приложения...');
    
    // 1. Список материалов
    initMaterialsList();
    
    // 2. FAQ
    initFAQ();
    
    // 3. Валюты
    initCurrency();
    
    // 4. Навигация
    initNavigation();
    
    console.log('Приложение инициализировано');
    $('#app').append('<div class="alert alert-success" style="margin: 20px;">✓ Приложение полностью загружено</div>');
  }

  function initMaterialsList() {
    console.log('Инициализация списка материалов...');
    const $container = $('#materialsContainer');
    const $list = $('.materials-list');
    const $toggleBtn = $('.toggle-list-btn');

    if ($toggleBtn.length) {
      console.log('Кнопка списка материалов найдена');
      $toggleBtn.on('click', function() {
        $list.slideToggle(300);
        $container.toggleClass('active');
      });

      $(document).on('click', function(e) {
        if (!$container.is(e.target) &&
          $container.has(e.target).length === 0 &&
          $list.is(':visible')) {
          $list.slideUp(300);
          $container.removeClass('active');
        }
      });
    } else {
      console.warn('Элементы списка материалов не найдены');
    }
  }

  function initFAQ() {
    console.log('Инициализация FAQ...');
    const $faqQuestions = $('.faq-question');
    
    if ($faqQuestions.length) {
      console.log(`Найдено ${$faqQuestions.length} вопросов FAQ`);
      $('.faq-question').on('click', function(e) {
        e.preventDefault();
        const $question = $(this);
        const $answer = $question.next('.faq-answer');
        $answer.slideToggle(300);
        $question.toggleClass('active');
      });
    } else {
      console.warn('Вопросы FAQ не найдены');
    }
  }

  function initCurrency() {
    console.log('Инициализация переключения валют...');
    const $cards = $('.card');
    
    if ($cards.length) {
      console.log(`Найдено ${$cards.length} карточек с ценами`);
      // Сохраняем оригинальные цены при загрузке
      $('.card').each(function() {
        const priceElement = $(this).find('.price-new');
        const originalText = priceElement.text().trim();
        $(this).data('original-price', originalText);
      });

      // Обработка кнопок валют
      $('.currency-btn').on('click', function() {
        const card = $(this).closest('.card');
        const priceElement = card.find('.price-new');
        const originalPrice = card.data('original-price');
        const isDollar = $(this).find('svg.bi-currency-dollar').length > 0;

        if (isDollar) {
          const priceInRubles = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
          const priceInDollars = (priceInRubles / 70).toFixed(2);
          priceElement.text(`${priceInDollars} $`);
          card.find('.currency-btn').removeClass('active');
          $(this).addClass('active');
        } else {
          priceElement.text(originalPrice);
          card.find('.currency-btn').removeClass('active');
          $(this).addClass('active');
        }
      });
    } else {
      console.warn('Карточки с ценами не найдены');
    }
  }

  function initNavigation() {
    console.log('Инициализация навигации...');
    
    $('a.nav-link, .btn-warning').on('click', function(e) {
      if (this.hash !== '') {
        e.preventDefault();
        const hash = this.hash;
        console.log('Прокрутка к элементу:', hash);
        $('html, body').animate({
          scrollTop: $(hash).offset().top - 70
        }, 800);
      }
    });

    $(window).on('scroll', function() {
      let scrollPos = $(document).scrollTop() + 100;
      $('a.nav-link').each(function() {
        let currLink = $(this);
        let refElement = $(currLink.attr('href'));
        if (refElement.length && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $('a.nav-link').removeClass('active font-weight-bold');
          currLink.addClass('active font-weight-bold');
        }
      });
    });
    
    console.log('Навигация инициализирована');
  }
  
  console.log('Обработчик ready завершил настройку');
});

// Глобальная проверка загрузки файла
console.log('=== Файл main.js начал выполняться ===');