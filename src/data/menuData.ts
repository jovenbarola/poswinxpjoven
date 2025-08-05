export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'main-courses' | 'beverages' | 'desserts';
  image?: string;
}

const defaultMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: '1',
    name: 'Chicken Wings',
    description: 'Crispy buffalo wings served with ranch dipping sauce and celery sticks.',
    price: 12.99,
    category: 'appetizers',
    image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella cheese sticks with marinara sauce.',
    price: 8.99,
    category: 'appetizers',
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Loaded Nachos',
    description: 'Tortilla chips topped with melted cheese, jalapeños, sour cream, and guacamole.',
    price: 14.99,
    category: 'appetizers',
    image: 'https://images.pexels.com/photos/7843944/pexels-photo-7843944.jpeg?auto=compress&cs=tinysrgb&w=400',
  },

  // Main Courses
  {
    id: '4',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and pickles on a brioche bun.',
    price: 16.99,
    category: 'main-courses',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection with lemon butter sauce.',
    price: 24.99,
    category: 'main-courses',
    image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    name: 'Chicken Alfredo',
    description: 'Tender chicken breast over creamy fettuccine alfredo pasta.',
    price: 19.99,
    category: 'main-courses',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '7',
    name: 'BBQ Ribs',
    description: 'Fall-off-the-bone pork ribs with tangy BBQ sauce and coleslaw.',
    price: 22.99,
    category: 'main-courses',
    image: 'https://images.pexels.com/photos/5474640/pexels-photo-5474640.jpeg?auto=compress&cs=tinysrgb&w=400',
  },

  // Beverages
  {
    id: '8',
    name: 'Coca Cola',
    description: 'Classic refreshing cola served ice cold.',
    price: 2.99,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '9',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice packed with vitamin C.',
    price: 4.99,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '10',
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice with cream on the side.',
    price: 3.99,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '11',
    name: 'Craft Beer',
    description: 'Local craft beer selection - ask your server for today\'s options.',
    price: 5.99,
    category: 'beverages',
    image: 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg?auto=compress&cs=tinysrgb&w=400',
  },

  // Desserts
  {
    id: '12',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with chocolate frosting and berries.',
    price: 7.99,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '13',
    name: 'Vanilla Ice Cream',
    description: 'Premium vanilla ice cream served with whipped cream and cherry.',
    price: 4.99,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '14',
    name: 'Apple Pie',
    description: 'Traditional apple pie with cinnamon and served warm with vanilla ice cream.',
    price: 6.99,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/5946751/pexels-photo-5946751.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const getMenuItems = (): MenuItem[] => {
  const stored = localStorage.getItem('xp-food-menu');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored menu items:', error);
    }
  }
  
  // Initialize with default items
  localStorage.setItem('xp-food-menu', JSON.stringify(defaultMenuItems));
  return defaultMenuItems;
};

export const saveMenuItems = (items: MenuItem[]): void => {
  localStorage.setItem('xp-food-menu', JSON.stringify(items));
};

// Initialize demo users
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem('xp-food-users');
  if (!existingUsers) {
    const demoUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@foodapp.com',
        password: 'admin123',
        isAdmin: true,
      },
      {
        id: '2',
        username: 'demouser',
        email: 'demo@user.com',
        password: 'demo123',
        isAdmin: false,
      },
    ];
    localStorage.setItem('xp-food-users', JSON.stringify(demoUsers));
  }
};

// Initialize demo data on module load
initializeDemoUsers();