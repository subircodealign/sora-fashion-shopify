document.addEventListener('DOMContentLoaded', () => {

  const mobileContainer = document.getElementById('mobile-product-container');
  const mobilePagination = document.getElementById('mobile-pagination-controls');
  const mobileDataDiv = document.getElementById('mobile-product-pagination');
  const cartIconHTML = document.getElementById('icon-add-cart')?.innerHTML || '';

  if (mobileContainer && mobilePagination && mobileDataDiv) {
    mobilePaginationFunction(mobileContainer, mobilePagination, mobileDataDiv, cartIconHTML);
  }

  const desktopContainer = document.getElementById('product-container');
  const desktopPagination = document.getElementById('pagination-controls');
  const desktopDataDiv = document.getElementById('product-pagination');

  if (desktopContainer && desktopPagination && desktopDataDiv) {
    desktopPaginationFunction(desktopContainer, desktopPagination, desktopDataDiv, cartIconHTML);
  }
});

function mobilePaginationFunction(container, pagination, dataDiv, cartIconHTML) {
  const products = JSON.parse(dataDiv.dataset.products || '[]');
  const perPage = parseInt(dataDiv.dataset.perPage || '4');
  let currentPage = 1;

  const renderProducts = () => {
    container.innerHTML = '';
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentProducts = products.slice(start, end);

    currentProducts.forEach(product => {
      const html = `
        <div class="border p-4 flex flex-col h-full">
          <a href="${product.url}" class="block mb-4">
            <img src="${product.image}" alt="${product.title}" class="w-full h-[279px] object-cover" width="262" height="279" />
          </a>
          <div class="flex-grow">
            <a href="${product.url}">
              <h3 class="text-primary font-semibold text-[18px] leading-[28px] mb-1">${product.title}</h3>
            </a>
            <p class="text-[24px] leading-[36px] font-bold mb-3">${product.price}$</p>
          </div>
          <button type="button" class="mt-auto border btn-hover border-secondary text-secondary text-[16px] leading-[26px] px-6 py-3 flex items-center justify-center">
            Add To Cart ${cartIconHTML}
          </button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
  };

  const getPageRange = (current, total) => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

const renderButton = (label, page, iconType = null, isActive = false) => {
  if (label === '...') {
    return `<div class="w-9 h-10 text-zinc-800 text-sm font-medium flex items-center justify-center">...</div>`;
  }

  const baseClasses = `
    w-9 h-10 py-2 px-4
    ${isActive ? 'bg-[#6B749E] text-white' : 'text-zinc-800'}
    text-sm font-medium flex items-center justify-center rounded
  `.trim();

  if (iconType === 'prev' || iconType === 'next') {
    const iconSvg = iconType === 'prev'
      ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#6B749E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#6B749E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;

    return `<button class="${baseClasses}" data-page="${page}" type="button">${iconSvg}</button>`;
  }

  return `<button class="${baseClasses}" data-page="${page}" type="button">${label}</button>`;
};



  const renderPagination = () => {
    pagination.innerHTML = '';
    const pageCount = Math.ceil(products.length / perPage);



  pagination.innerHTML += renderButton('', Math.max(1, currentPage - 1), 'prev');

getPageRange(currentPage, pageCount).forEach(p => {
  pagination.innerHTML += renderButton(p, p, null, p === currentPage);
});

pagination.innerHTML += renderButton('', Math.min(pageCount, currentPage + 1), 'next');


    pagination.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();

        const page = Number(btn.dataset.page);
        if (!isNaN(page) && page !== currentPage) {
          currentPage = page;
          renderProducts();
          renderPagination();

          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  renderProducts();
  renderPagination();
}

function desktopPaginationFunction(container, pagination, dataDiv, cartIconHTML) {
  const products = JSON.parse(dataDiv.dataset.products || '[]');
  let perPage = 12;
  const width = window.innerWidth;

  if (width < 768) {
    perPage = parseInt(dataDiv.dataset.perPageMobile || '6');
  } else if (width < 1024) {
    perPage = parseInt(dataDiv.dataset.perPageTablet || '8');
  } else {
    perPage = parseInt(dataDiv.dataset.perPageDesktop || '12');
  }

  let currentPage = 1;

  const colorMap = {
    'steel-blue': '#6B749E',
    'brownish-red': '#9E5A4F',
    'light-brown': '#AD8A77',
    'black': '#2F2F2F',
    'soft-ivory': '#EBE1DC',
    'soft-sand': '#E5C3A1',
    'purple': '#886B9E',
    'light-cool-gray': '#C0C6C6'
  };

  const renderProducts = () => {
    container.innerHTML = '';
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentProducts = products.slice(start, end);

    currentProducts.forEach(product => {
      const colorsHTML = product.colors?.slice(0, 3).map(colorKey => {
        const color = colorMap[colorKey] || colorKey;
        return `<span class="w-3 h-3 rounded-full border border-gray-300" style="background-color: ${color};" title="${colorKey}"></span>`;
      }).join('') || `<span class="w-3 h-3 rounded-full bg-gray-300"></span>`;

      const html = `
        <div class="border p-4 flex flex-col h-full">
          <a href="${product.url}" class="block mb-4">
            <img src="${product.image}" alt="${product.title}" class="w-full h-[279px] object-cover" width="262" height="279" />
          </a>
          <div class="flex-grow">
            <a href="${product.url}">
              <h3 class="text-primary font-semibold text-[18px] leading-[28px] mb-1">${product.title}</h3>
            </a>
            <p class="text-[24px] leading-[36px] font-bold mb-3">${product.price}$</p>
            <div class="flex space-x-2 mb-4">${colorsHTML}</div>
          </div>
          <button type="button" class="mt-auto border border-secondary text-secondary text-[16px] leading-[26px] px-6 py-3 flex items-center justify-center btn-hover">
            Add To Cart ${cartIconHTML}
          </button>
        </div>
      `;

      container.insertAdjacentHTML('beforeend', html);
    });
  };

  const getPageRange = (current, total) => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  const renderButton = (label, page, isIcon = false, isActive = false) => {
    if (label === '...') {
      return `<div class="w-9 h-10 box-border text-zinc-800 text-sm font-medium font-['DM_Sans'] leading-tight flex items-center justify-center">...</div>`;
    }

    const baseClasses = `
      w-9 h-10 py-2 px-4 box-border
      ${isActive ? 'bg-[#6B749E] text-white' : 'text-zinc-800'}
      text-sm font-medium font-['DM_Sans'] leading-tight
      flex items-center justify-center rounded
    `.trim();

    return `<button class="${baseClasses}" data-page="${page}" type="button">${label}</button>`;
  };

  const renderPagination = () => {
    pagination.innerHTML = '';
    const pageCount = Math.ceil(products.length / perPage);

    const prevIcon = document.getElementById('icon-prev')?.innerHTML || '&larr;';
    const nextIcon = document.getElementById('icon-next')?.innerHTML || '&rarr;';

    pagination.innerHTML += renderButton(prevIcon, Math.max(1, currentPage - 1), true);

    getPageRange(currentPage, pageCount).forEach(p => {
      pagination.innerHTML += renderButton(p, p, false, p === currentPage);
    });

    pagination.innerHTML += renderButton(nextIcon, Math.min(pageCount, currentPage + 1), true);

    pagination.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();

        const page = Number(btn.dataset.page);
        if (!isNaN(page) && page !== currentPage) {
          currentPage = page;
          renderProducts();
          renderPagination();

          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  renderProducts();
  renderPagination();
}
