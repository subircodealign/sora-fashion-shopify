document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blog-container');
  const pagination = document.getElementById('pagination-controls');
  const dataDiv = document.getElementById('blog-pagination');

  if (container && pagination && dataDiv) {
    blogPaginationFunction(container, pagination, dataDiv);
  }
});

function blogPaginationFunction(container, pagination, dataDiv) {
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
        <div class="border p-4 flex flex-col h-full">
          <a href="${blog.url}" class="block mb-4">
            <img src="${blog.image}" alt="${blog.title}" class="w-full h-[279px] object-cover" width="262" height="279" />
          </a>
          <div class="flex-grow">
            <a href="${blog.url}">
              <h3 class="text-primary font-semibold text-[18px] leading-[28px] mb-1">${blog.title}</h3>
            </a>
            <p class="text-zinc-500 text-[16px] leading-[24px] mb-3">${blog.description}</p>
          </div>
          <a href="${blog.url}" class="mt-auto border border-secondary text-secondary text-[16px] leading-[26px] px-6 py-3 flex items-center justify-center hover:bg-gray-100 transition duration-150">
            Read More
            ${document.getElementById('icon-read-more')?.innerHTML || ''}
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
      return `<div class="w-9 h-10 text-zinc-800 text-sm font-medium flex items-center justify-center">...</div>`;
    }

    const baseClasses = `
      w-9 h-10 py-2 px-4
      ${isActive ? 'bg-[#6B749E] text-white' : 'text-zinc-800'}
      text-sm font-medium flex items-center justify-center rounded
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
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = Number(btn.dataset.page);
        if (!isNaN(page) && page !== currentPage) {
          currentPage = page;
          renderBlogs();
          renderPagination();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  renderBlogs();
  renderPagination();
}
