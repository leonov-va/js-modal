let cards = [
  {
    id: parseInt(Math.random() * Date.now()),
    title: 'Cofe',
    price: 10,
    img: 'https://cdn.pixabay.com/photo/2021/01/30/09/59/coffee-5963334__340.jpg'
  },
  {
    id: parseInt(Math.random() * Date.now()),
    title: 'Butterbrod',
    price: 1000,
    img: 'https://cdn.pixabay.com/photo/2020/10/01/22/39/gourmet-5619887__340.jpg'
  },
  {
    id: parseInt(Math.random() * Date.now()),
    title: 'Nature',
    price: 10000,
    img: 'https://cdn.pixabay.com/photo/2021/02/08/18/13/trees-5995892__340.jpg'
  },
]

const toHTML = ({id, img, title}) => `
  <div class="col">
    <div class="card">
      <img src="${img}" class="card-img-top" alt="${title}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <a href="#" class="btn btn-primary" data-btn="price" data-id="${id}">Show price</a>
        <a href="#" class="btn btn-danger" data-btn="remove" data-id="${id}">Delete</a>
      </div>
    </div>
  </div>
`;

function render () {
  const html = cards.map(toHTML).join('');
  document.querySelector('#cards').innerHTML = html;
}
render();

const priceModal = $.modal({
  title: 'Цена на товар',
  closable: true,
  width: '400px',
  footerButtons: [
    {
      text: 'Закрыть', 
      type: 'primary', 
      handler() {
        priceModal.close();
      }
    },
  ]
});

document.addEventListener('click', event => {
  event.preventDefault();
  const btnType = event.target.dataset.btn;
  const id = parseInt(event.target.dataset.id);
  const card = cards.find(f => f.id === id);
  
  if (btnType === 'price') {
    priceModal.setContent(`
      <p>Цена на ${card.title}: <strong>${card.price}</strong></p>
    `);
    priceModal.open();
  } else if (btnType === 'remove') {
    $.confirm({
      title: 'Вы уверены?',
      content: `<p>Вы удаляете карточку: <strong>${card.title}</strong></p>`
    })
      .then(() => {
        cards = cards.filter(c => c.id !== id);
        render();
      })
      .catch(() => {
        console.log('##### not');
      });
  }
})
