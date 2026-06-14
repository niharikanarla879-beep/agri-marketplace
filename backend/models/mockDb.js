const bcrypt = require("bcryptjs");

// Central data store for mock DB
const mockData = {
  users: [],
  products: [],
  orders: []
};

// Seed default accounts and products
const seedMockDb = () => {
  const hashedFarmer = bcrypt.hashSync("farmer123", 10);
  const hashedBuyer = bcrypt.hashSync("buyer123", 10);
  const hashedAdmin = bcrypt.hashSync("admin123", 10);

  const farmerUser = {
    _id: "farmer_ramesh_123",
    name: "Ramesh Kumar",
    email: "farmer@agri.com",
    password: hashedFarmer,
    role: "farmer",
    wishlist: []
  };

  const buyerUser = {
    _id: "buyer_niharika_123",
    name: "Niharika N.",
    email: "buyer@gmail.com",
    password: hashedBuyer,
    role: "customer",
    wishlist: []
  };

  const adminUser = {
    _id: "admin_moderator_123",
    name: "Admin Moderator",
    email: "admin@agri.com",
    password: hashedAdmin,
    role: "admin",
    wishlist: []
  };

  mockData.users = [farmerUser, buyerUser, adminUser];

  mockData.products = [
    {
      _id: "prod_tomato_123",
      name: "Fresh Red Tomatoes",
      price: 40,
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=600",
      description: "Harvested fresh daily from greenhouse fields. High-quality and rich in Lycopene.",
      category: "Vegetables",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 200,
      reviews: []
    },
    {
      _id: "prod_carrot_123",
      name: "Organic Sweet Carrots",
      price: 50,
      image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=600",
      description: "Crunchy sweet carrots, completely chemical-free and grown in certified organic soil.",
      category: "Vegetables",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 120,
      reviews: []
    },
    {
      _id: "prod_wheat_123",
      name: "Premium Wheat Grain Bag",
      price: 780,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600",
      description: "Premium quality whole wheat grains, cleaned and packaged in a durable 25kg bag.",
      category: "Grains",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 40,
      reviews: []
    },
    {
      _id: "prod_milk_123",
      name: "Farm Fresh Milk",
      price: 65,
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600",
      description: "Raw pasteurized creamy cow milk, delivered fresh within hours of milking.",
      category: "Dairy",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 80,
      reviews: []
    },
    {
      _id: "prod_banana_123",
      name: "Organic Yellow Bananas",
      price: 60,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600",
      description: "Naturally ripened sweet bananas, free from chemical ripening agents.",
      category: "Fruits",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 100,
      reviews: []
    },
    {
      _id: "prod_npk_123",
      name: "High Grade NPK Fertilizer",
      price: 450,
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600",
      description: "Balanced Nitrogen-Phosphorus-Potassium nutrients blend to optimize crops yields.",
      category: "Fertilizers",
      farmer: { _id: farmerUser._id, name: farmerUser.name, email: farmerUser.email },
      inventory: 50,
      reviews: []
    }
  ];
  console.log("Mock Database initialized with default testing parameters.");
};

seedMockDb();

class MockQuery {
  constructor(results) {
    this.results = results;
  }
  populate() { return this; }
  sort(options) {
    if (!options) return this;
    const key = Object.keys(options)[0];
    const order = options[key];
    this.results.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === 1 ? aVal - bVal : bVal - aVal;
      }
      return order === 1 
        ? String(aVal).localeCompare(String(bVal)) 
        : String(bVal).localeCompare(String(aVal));
    });
    return this;
  }
  skip(num) {
    this.results = this.results.slice(num);
    return this;
  }
  limit(num) {
    this.results = this.results.slice(0, num);
    return this;
  }
  select() { return this; }
  then(onfulfilled, onrejected) {
    return Promise.resolve(this.results).then(onfulfilled, onrejected);
  }
}

class MockUser {
  constructor(data) {
    this._id = data._id || "user_" + Math.random().toString(36).substring(2, 9);
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || "customer";
    this.wishlist = data.wishlist || [];
  }

  async save() {
    const idx = mockData.users.findIndex(u => u._id === this._id);
    const doc = {
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      wishlist: this.wishlist
    };
    if (idx > -1) {
      mockData.users[idx] = doc;
    } else {
      mockData.users.push(doc);
    }
    return this;
  }

  toObject() {
    return { ...this };
  }

  static findOne(query) {
    const emailToSearch = query.email ? query.email.toLowerCase().trim() : null;
    let u = mockData.users.find(x => x.email === emailToSearch);
    if (!u) return Promise.resolve(null);
    return Promise.resolve(new MockUser(u));
  }

  static findById(id) {
    const targetId = id ? id.toString() : null;
    let u = mockData.users.find(x => x._id === targetId);
    if (!u) {
      return {
        select: () => ({
          populate: () => Promise.resolve(null)
        }),
        then: (cb) => Promise.resolve(null).then(cb)
      };
    }
    const userInstance = new MockUser(u);
    return {
      select: function(fields) {
        return {
          populate: function(path) {
            const populated = { ...userInstance };
            if (path === "wishlist") {
              populated.wishlist = userInstance.wishlist.map(pid => {
                const prod = mockData.products.find(p => p._id === pid.toString() || p._id === pid);
                return prod ? new MockProduct(prod) : pid;
              });
            }
            return Promise.resolve(populated);
          }
        };
      },
      then: function(onfulfilled, onrejected) {
        return Promise.resolve(userInstance).then(onfulfilled, onrejected);
      }
    };
  }
}

class MockProduct {
  constructor(data) {
    this._id = data._id || "prod_" + Math.random().toString(36).substring(2, 9);
    this.name = data.name;
    this.price = data.price;
    this.image = data.image;
    this.description = data.description;
    this.category = data.category;
    this.farmer = data.farmer;
    this.inventory = data.inventory !== undefined ? data.inventory : 100;
    this.reviews = data.reviews || [];
  }

  async save() {
    const idx = mockData.products.findIndex(p => p._id === this._id);
    const doc = {
      _id: this._id,
      name: this.name,
      price: this.price,
      image: this.image,
      description: this.description,
      category: this.category,
      farmer: this.farmer,
      inventory: this.inventory,
      reviews: this.reviews
    };
    if (idx > -1) {
      mockData.products[idx] = doc;
    } else {
      mockData.products.push(doc);
    }
    return this;
  }

  static find(query) {
    let list = [...mockData.products];
    if (query) {
      if (query.farmer) {
        list = list.filter(p => {
          const fid = p.farmer?._id || p.farmer;
          return fid === query.farmer;
        });
      }
      if (query.name && query.name.$regex) {
        const regex = new RegExp(query.name.$regex, query.name.$options || "i");
        list = list.filter(p => regex.test(p.name));
      }
      if (query.category) {
        list = list.filter(p => p.category === query.category);
      }
    }
    // Convert to model instances
    const instances = list.map(item => new MockProduct(item));
    return new MockQuery(instances);
  }

  static async countDocuments(query) {
    const queryResults = await MockProduct.find(query);
    return queryResults.length;
  }

  static findById(id) {
    const targetId = id ? id.toString() : null;
    let p = mockData.products.find(x => x._id === targetId);
    if (!p) {
      return {
        populate: () => ({
          populate: () => Promise.resolve(null)
        }),
        then: (cb) => Promise.resolve(null).then(cb)
      };
    }
    const prodInstance = new MockProduct(p);
    return {
      populate: function(path) {
        return {
          populate: function(innerPath) {
            const populated = { ...prodInstance };
            // Populate farmer
            if (typeof populated.farmer === "string") {
              const farm = mockData.users.find(u => u._id === populated.farmer);
              if (farm) populated.farmer = { _id: farm._id, name: farm.name, email: farm.email };
            }
            // Populate reviews user names
            populated.reviews = populated.reviews.map(rev => {
              const rUser = mockData.users.find(u => u._id === (rev.user?._id || rev.user));
              return {
                ...rev,
                user: rUser ? { _id: rUser._id, name: rUser.name } : rev.user
              };
            });
            return Promise.resolve(populated);
          }
        };
      },
      then: function(onfulfilled, onrejected) {
        return Promise.resolve(prodInstance).then(onfulfilled, onrejected);
      }
    };
  }

  static findByIdAndDelete(id) {
    const targetId = id ? id.toString() : null;
    mockData.products = mockData.products.filter(x => x._id !== targetId);
    return Promise.resolve({ message: "Product deleted" });
  }
}

class MockOrder {
  constructor(data) {
    this._id = data._id || "order_" + Math.random().toString(36).substring(2, 9);
    this.buyer = data.buyer;
    this.customerName = data.customerName;
    this.address = data.address;
    this.phoneNumber = data.phoneNumber;
    this.paymentMethod = data.paymentMethod || "Cash On Delivery";
    this.status = data.status || "Pending";
    this.items = data.items || [];
    this.totalPrice = data.totalPrice;
    this.createdAt = data.createdAt || new Date();
  }

  async save() {
    const idx = mockData.orders.findIndex(o => o._id === this._id);
    const doc = {
      _id: this._id,
      buyer: this.buyer,
      customerName: this.customerName,
      address: this.address,
      phoneNumber: this.phoneNumber,
      paymentMethod: this.paymentMethod,
      status: this.status,
      items: this.items,
      totalPrice: this.totalPrice,
      createdAt: this.createdAt
    };
    if (idx > -1) {
      mockData.orders[idx] = doc;
    } else {
      mockData.orders.push(doc);
    }
    return this;
  }

  static find(query) {
    let list = [...mockData.orders];
    if (query) {
      if (query.buyer) {
        list = list.filter(o => {
          const bid = o.buyer?._id || o.buyer;
          return bid === query.buyer;
        });
      }
      if (query["items.farmerId"]) {
        list = list.filter(o => {
          return o.items.some(item => {
            const fid = item.farmerId?._id || item.farmerId;
            return fid === query["items.farmerId"];
          });
        });
      }
    }
    const instances = list.map(item => new MockOrder(item));
    return new MockQuery(instances);
  }

  static findById(id) {
    const targetId = id ? id.toString() : null;
    let o = mockData.orders.find(x => x._id === targetId);
    if (!o) return Promise.resolve(null);
    return Promise.resolve(new MockOrder(o));
  }
}

module.exports = {
  mockData,
  MockUser,
  MockProduct,
  MockOrder
};
