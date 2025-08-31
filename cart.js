
/* js/cart-core.js */
(function (w) {
  const STORAGE_KEY = 'cart';

  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  };
  const save = (c) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  const findIdx = (c, id) => c.findIndex(i => String(i.id) === String(id));

  const Cart = {
    get() { return load(); },
    clear() { save([]); return []; },
    count() { return load().reduce((s,i)=>s+(i.quantity||1),0); },
    subtotal() { return load().reduce((s,i)=> s + Number(i.price)*Number(i.quantity||1), 0); },

    add(item) {
      const cart = load();
      const idx = findIdx(cart, item.id);
      if (idx > -1) {
        cart[idx].quantity = (cart[idx].quantity || 1) + (item.quantity || 1);
      } else {
        cart.push({
          id: String(item.id),
          title: item.title,
          price: Number(item.price),
          image: item.image || '',
          quantity: item.quantity || 1
        });
      }
      save(cart);
      return cart;
    },

    inc(id) {
      const cart = load();
      const idx = findIdx(cart, id);
      if (idx > -1) { cart[idx].quantity += 1; save(cart); }
      return cart;
    },

    dec(id) {
      const cart = load();
      const idx = findIdx(cart, id);
      if (idx > -1) {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        save(cart);
      }
      return cart;
    },

    setQty(id, qty) {
      const cart = load();
      const idx = findIdx(cart, id);
      if (idx > -1) {
        if (qty <= 0) cart.splice(idx, 1);
        else cart[idx].quantity = qty;
        save(cart);
      }
      return cart;
    },

    remove(id) {
      const next = load().filter(i => String(i.id) !== String(id));
      save(next);
      return next;
    }
  };

  w.Cart = Cart;
})(window);

