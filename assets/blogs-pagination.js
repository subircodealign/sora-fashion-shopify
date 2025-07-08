document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blog-container');
  const pagination = document.getElementById('pagination-controls');
  const dataDiv = document.getElementById('blog-pagination');
  const readMoreIconHTML = document.getElementById('icon-read-more')?.innerHTML || '';

  if (!container || !pagination || !dataDiv) return;

  const blogs = JSON.parse(dataDiv.dataset.blogs || '[]');
  const perPage = parseInt(dataDiv.dataset.perPage || '8');
  let currentPage = 1;

  const renderBlogs = () => {
    container.innerHTML = '';
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentBlogs = blogs.slice(start, end);

    currentBlogs.forEach(blog => {
      const html = `
        <div class="p-4 bg-neutral-100 flex flex-col items-start gap-4">
          <a href="${blog.url}" class="block w-full">
            <img src="${blog.image}" alt="${blog.title}" class="w-full h-64 object-cover" />
          </a>
          <div class="w-full flex flex-col items-start gap-2">
            <h3 class="w-full text-primary text-lg font-semibold font-figtree leading-7">${blog.title}</h3>
            <p class="w-full text-justify text-accent text-xs font-normal font-figtree leading-[16px]">${blog.description || 'Our more blogs hand pick by us'}</p>
          </div>
          <a href="${blog.url}" class="w-full px-6 py-3 border-secondary border flex justify-center items-center gap-1  transition-colors">
            <span class="text-secondary text-base font-normal font-['Figtree'] leading-relaxed ">Read Full Blog</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
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
    const pageCount = Math.ceil(blogs.length / perPage);

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
          renderBlogs();
          renderPagination();
        }
      });
    });
  };

  renderBlogs();
  renderPagination();
});