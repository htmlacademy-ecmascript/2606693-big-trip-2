const shuffleArray = (items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const getRandomItemsArray = (items, count) => shuffleArray([...items]).slice(0, count);

const isEscapeKey = (evt) => evt.key === 'Escape';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {getRandomItemsArray, isEscapeKey, updateItem};
