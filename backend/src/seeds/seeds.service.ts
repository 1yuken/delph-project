import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class SeedsService {
  private readonly logger = new Logger(SeedsService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async seedUsers() {
    this.logger.log('Начинаем заполнение пользователей...');

    const users = [
      {
        username: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        role: 'client',
      },
      {
        username: 'admin',
        email: 'admin@delph.com',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'Администратор',
        lastName: 'Системы',
        isActive: true,
        role: 'admin',
      },
      {
        username: 'freelancer1',
        email: 'freelancer1@delph.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Иван',
        lastName: 'Петров',
        isActive: true,
        role: 'freelancer',
      },
      {
        username: 'client1',
        email: 'client1@delph.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Мария',
        lastName: 'Сидорова',
        isActive: true,
        role: 'client',
      },
      {
        username: 'freelancer2',
        email: 'freelancer2@delph.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Алексей',
        lastName: 'Козлов',
        isActive: true,
        role: 'freelancer',
      },
      {
        username: 'client2',
        email: 'client2@delph.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Елена',
        lastName: 'Волкова',
        isActive: true,
        role: 'client',
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: [{ username: userData.username }, { email: userData.email }],
      });

      if (!existingUser) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        this.logger.log(`Создан пользователь: ${userData.username}`);
      } else {
        this.logger.log(`Пользователь уже существует: ${userData.username}`);
      }
    }

    this.logger.log('Заполнение пользователей завершено');
  }

  async seedItems() {
    this.logger.log('Начинаем заполнение технологий...');

    const items = [
      {
        id: 1,
        name: 'Angular',
        image: '/images/angular.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 2,
        name: 'ASP.NET',
        image: '/images/aspnet.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Корпоративные приложения',
      },
      {
        id: 3,
        name: 'Adobe XD',
        image: '/images/adobe-xd.png',
        categories:
          'Создание дизайна,Обучение дизайну,Прототипирование проекта,Прочее',
      },
      {
        id: 4,
        name: 'Backbone.js',
        image: '/images/backbone.png',
        categories:
          'Создание сайта,Разработка UI,Веб-приложения,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 5,
        name: 'Bootstrap',
        image: '/images/bootstrap.png',
        categories:
          'Веб-разработка,Оптимизация кода,Верстка сайтов,Обучение,Разработка адаптивного дизайна',
      },
      {
        id: 6,
        name: 'C',
        image: '/images/c.png',
        categories:
          'Встроенные системы,Оптимизация,Разработка игр,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 7,
        name: 'C++',
        image: '/images/c-plus.png',
        categories:
          'Разработка игр,Оптимизация кода,Создание движков,Обучение,Искусственный интеллект',
      },
      {
        id: 8,
        name: 'C#',
        image: '/images/c-sharp.png',
        categories:
          'Создание игр(Unity),Веб разработка,Десктопные приложения,Обучение,Прочее',
      },
      {
        id: 9,
        name: 'CakePHP',
        image: '/images/cakephp.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 10,
        name: 'Django',
        image: '/images/django.png',
        categories:
          'Веб-разработка,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 11,
        name: 'Dart',
        image: '/images/dart.png',
        categories:
          'Мобильные приложения,Веб-разработка,API,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 12,
        name: 'Express.js',
        image: '/images/expressjs.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 13,
        name: 'Electron',
        image: '/images/electron.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 14,
        name: 'Elixir',
        image: '/images/elixir.png',
        categories:
          'Создание дизайна,Обучение дизайну,Прототипирование проекта,Прочее',
      },
      {
        id: 15,
        name: 'FastAPI',
        image: '/images/fastapi.png',
        categories:
          'Создание API,Оптимизация кода,Машинное обучение,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 16,
        name: 'Flask',
        image: '/images/flask.png',
        categories:
          'Веб-разработка,Оптимизация кода,Создание REST API,Обучение,Корпоративные приложения',
      },
      {
        id: 17,
        name: 'Figma',
        image: '/images/figma.png',
        categories:
          'Создание дизайна,Обучение дизайну,Прототипирование проекта,Прочее',
      },
      {
        id: 18,
        name: 'Java',
        image: '/images/java.png',
        categories:
          'Android-приложения,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 19,
        name: 'JavaScript',
        image: '/images/javascript.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Корпоративные приложения',
      },
      {
        id: 20,
        name: 'Julia',
        image: '/images/julia.png',
        categories:
          'Анализ данных,Искусственный интелект,Машинное обучение,Научные исследования,Прочее',
      },
      {
        id: 21,
        name: 'jQuery',
        image: '/images/jquery.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 22,
        name: 'Koa.js',
        image: '/images/koajs.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 23,
        name: 'Kotlin',
        image: '/images/kotlin.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Корпоративные приложения',
      },
      {
        id: 24,
        name: 'Lisp',
        image: '/images/lisp.png',
        categories:
          'Искусственный интеллект,Оптимизация кода,Машинное обучение,Компиляторы',
      },
      {
        id: 25,
        name: 'Lua',
        image: '/images/lua.png',
        categories:
          'Скрипты для игр,Автоматизация,Обучение,Встраиваемый язык для приложений',
      },
      {
        id: 26,
        name: 'Laravel',
        image: '/images/laravel.png',
        categories:
          'Веб-разработка,Создание API,Разработка CRM и ERP-систем,Обучение,Прочее',
      },
      {
        id: 27,
        name: 'MATLAB',
        image: '/images/matlab.png',
        categories:
          'Математические расчёты,Оптимизация кода,Скрипты и боты,Обучение',
      },
      {
        id: 28,
        name: 'Meteor.js',
        image: '/images/meteorjs.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Корпоративные приложения',
      },
      {
        id: 29,
        name: 'Next.js',
        image: '/images/nextjs.png',
        categories:
          'Веб-разработка,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 30,
        name: 'NestJS',
        image: '/images/nestjs.png',
        categories:
          'Веб-разработка,Оптимизация кода,API,Обучение,Корпоративные приложения',
      },
      {
        id: 31,
        name: 'Nim',
        image: '/images/nim.png',
        categories:
          'Веб-разработка,Оптимизированные приложения,Разработка API,Прочее',
      },
      {
        id: 32,
        name: 'NuxtJS',
        image: '/images/nuxtjs.png',
        categories:
          'Веб-разработка,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 33,
        name: 'Objective-C',
        image: '/images/objectivec.png',
        categories:
          'Разработка iOS-приложений,Оптимизация кода,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 34,
        name: 'OCaml',
        image: '/images/ocaml.png',
        categories:
          'Компиляторы,Оптимизация кода,Обучение,Корпоративные приложения',
      },
      {
        id: 35,
        name: 'Oberon',
        image: '/images/oberon.png',
        categories:
          'Разработка операционных систем,Обучение,Разработка компиляторов,Прочее',
      },
      {
        id: 36,
        name: 'Pascal',
        image: '/images/pascal.png',
        categories:
          'Десктопные приложения,Разработка образовательного ПО,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 37,
        name: 'Perl',
        image: '/images/perl.png',
        categories:
          'Обработка текста,Автоматизация сложных задач,Обучение,DevOps,Прочее',
      },
      {
        id: 38,
        name: 'PHP',
        image: '/images/php.png',
        categories:
          'Веб-разработка,Создание CMS(WordPress),Создание API,Прочее',
      },
      {
        id: 39,
        name: 'Python',
        image: '/images/python.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 40,
        name: 'React.js',
        image: '/images/reactjs.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 41,
        name: 'R',
        image: '/images/r.png',
        categories:
          'Машинное обучение,Оптимизация кода,Визуализация данных,Обучение',
      },
      {
        id: 42,
        name: 'Ruby',
        image: '/images/ruby.png',
        categories:
          'Веб-разработка,Чат-боты,Прототипирование проекта,Разработка API,Прочее',
      },
      {
        id: 43,
        name: 'Rust',
        image: '/images/rust.png',
        categories:
          'Безопасное ПО,Оптимизация кода,Скрипты и боты,Обучение,Разработка игр',
      },
      {
        id: 44,
        name: 'Scala',
        image: '/images/scala.png',
        categories:
          'Анализ данных,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 45,
        name: 'Swift',
        image: '/images/swift.png',
        categories:
          'Разработка iOS-приложений,Оптимизация кода,Обучение,Десктопные приложения',
      },
      {
        id: 46,
        name: 'Spring Boot',
        image: '/images/springboot.png',
        categories:
          'Разработка веб-приложений,Создание REST API,Интеграции,Прочее',
      },
      {
        id: 47,
        name: 'Svelte',
        image: '/images/svelte.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 48,
        name: 'Sketch',
        image: '/images/sketch.png',
        categories:
          'Веб-дизайн,Создание макетов,Обучение,Прототипирование проекта,Прочее',
      },
      {
        id: 49,
        name: 'TypeScript',
        image: '/images/typescript.png',
        categories:
          'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение,Фикс багов и рефакторинг',
      },
      {
        id: 50,
        name: 'Tailwind CSS',
        image: '/images/tailwindcss.png',
        categories:
          'Веб-разработка,Вёрстка сайтов,UI-дизайн,Оптимизация кода,Обучение',
      },
      {
        id: 51,
        name: 'Vue.js',
        image: '/images/vuejs.png',
        categories: 'Создание сайта,Оптимизация кода,Скрипты и боты,Обучение',
      },
      {
        id: 55,
        name: 'HTML',
        image: '/images/html.png',
        categories:
          'Веб-разработка,Оптимизация кода,Верстка сайтов,Обучение,Разработка адаптивного дизайна',
      },
    ];

    for (const itemData of items) {
      const existingItem = await this.itemRepository.findOne({
        where: { id: itemData.id },
      });

      if (!existingItem) {
        const item = this.itemRepository.create(itemData);
        await this.itemRepository.save(item);
        this.logger.log(`Создана технология: ${itemData.name}`);
      } else {
        this.logger.log(`Технология уже существует: ${itemData.name}`);
      }
    }

    this.logger.log('Заполнение технологий завершено');
  }

  async seedAll() {
    const details: string[] = [];

    try {
      await this.seedUsers();
      details.push('Пользователи успешно созданы');

      await this.seedItems();
      details.push('Технологии успешно созданы');

      return {
        message: 'Все сиды успешно выполнены',
        details,
      };
    } catch (error) {
      this.logger.error('Ошибка при выполнении сидов:', error);
      throw error;
    }
  }

  async clearAll() {
    this.logger.log('Очистка базы данных...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Отключаем проверку внешних ключей
      await queryRunner.query('SET session_replication_role = replica;');

      // Очищаем таблицы в правильном порядке (сначала зависимые, потом основные)
      const tablesToClear = [
        'order', // таблица заказов (зависит от item и user)
        'portfolio', // портфолио (зависит от user)
        'review', // отзывы (зависит от user)
        'message', // сообщения (зависит от user)
        'transactions', // транзакции (зависит от user)
        'item', // технологии
        'user', // пользователи
      ];

      for (const table of tablesToClear) {
        try {
          await queryRunner.query(
            `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
          );
          this.logger.log(`Таблица ${table} очищена`);
        } catch (error) {
          this.logger.warn(
            `Не удалось очистить таблицу ${table}: ${error.message}`,
          );
        }
      }

      // Включаем обратно проверку внешних ключей
      await queryRunner.query('SET session_replication_role = DEFAULT;');

      await queryRunner.commitTransaction();

      this.logger.log('База данных очищена');
      return { message: 'База данных успешно очищена' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Ошибка при очистке базы данных:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
