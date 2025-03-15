const pool = require('./db');

const seedData = [
  {
    name: 'Produce',
    items: [
      {
        name: 'Lettuce',
        items: ['Romaine', 'IceBerg']
      },
      {
        name: 'Tomatoes',
        items: ['Heirloom', 'On-vine']
      },
      'Blackberries',
      'Blueberries',
      {
        name: 'Onions',
        items: ['Red', 'Yellow']
      }
    ]
  },
  {
    name: 'Meat',
    items: [
      {
        name: 'Beef',
        items: ['Steak', 'Ground']
      },
      {
        name: 'Chicken',
        items: ['Whole', 'Breast']
      },
      {
        name: 'Fish',
        items: ['Cod', 'Halibut']
      },
      {
        name: 'Pork',
        items: ['Chop', 'Bacon']
      },
      {
        name: 'Mystery',
        items: ['Vienna Sausage', 'Hot Dogs']
      }
    ]
  },
  {
    name: 'Dairy',
    items: [
      {
        name: 'Cheese',
        items: ['Cheddar', 'Mozza']
      },
      {
        name: 'Milk',
        items: ['Whole', 'Skim', 'Chocoy']
      },
      {
        name: 'Yogurt',
        items: ['Greek', 'With Fruit']
      },
      {
        name: 'Butter',
        items: ['Real', 'Fake']
      }
    ]
  },
  {
    name: 'Bakery',
    items: [
      {
        name: 'Muffins',
        items: ['Yummy', 'Healthy']
      },
      {
        name: 'Sourdough',
        items: ['Olive', 'Cheese', 'Cranberry brie']
      },
      {
        name: 'Bagels',
        items: ['Blueberry', 'Everything', 'Pretzel']
      },
      {
        name: 'Cookies',
        items: ['Peanut Butter', 'Oatmeal', 'Double Chocolate']
      }
    ]
  },
  {
    name: 'Dry Goods',
    items: ['Flour', 'Salt', 'Sugar', 'Condensed Soup', 'Ramen']
  }
];

const getRandomQuantity = () => Math.floor(Math.random() * 100) + 1;

const seedDatabase = async () => {
  try {
    for (const categoryData of seedData) {
      const catResult = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [categoryData.name]
      );
      const categoryId = catResult.rows[0].id;

      const processItem = async (item) => {
        if (typeof item === 'string') {
          await pool.query(
            'INSERT INTO items (name, quantity, category_id) VALUES ($1, $2, $3)',
            [item, getRandomQuantity(), categoryId]
          );
        } else if (typeof item === 'object' && item.items) {
          const subcategoryName = item.name;
          for (const subItem of item.items) {
            const compositeName = `${subcategoryName} - ${subItem}`;
            await pool.query(
              'INSERT INTO items (name, quantity, category_id) VALUES ($1, $2, $3)',
              [compositeName, getRandomQuantity(), categoryId]
            );
          }
        }
      };

      for (const item of categoryData.items) {
        await processItem(item);
      }
    }
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    pool.end();
  }
};

seedDatabase();
