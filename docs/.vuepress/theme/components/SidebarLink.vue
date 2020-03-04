<script>
import { isActive, hashRE, groupHeaders } from '../util';

export default {
  functional: true,
  props: ['item', 'sidebarDepth'],
  render(
    h,
    {
      parent: { $page, $site, $route, $themeConfig, $themeLocaleConfig },
      props: { item, sidebarDepth },
    },
  ) {
    // use custom active class matching logic
    // due to edge case of paths ending with / + hash
    const selfActive = isActive($route, item.path);
    // for sidebar: auto pages, a hash link should be active if one of its child
    // matches
    const active =
      item.type === 'auto'
        ? selfActive ||
          item.children.some(c =>
            isActive($route, item.basePath + '#' + c.slug),
          )
        : selfActive;
    const link =
      item.type === 'external'
        ? renderExternal(h, item.path, item.title || item.path)
        : renderLink(h, item.path, item.title || item.path, active);

    const maxDepth = [
      $page.frontmatter.sidebarDepth,
      sidebarDepth,
      $themeLocaleConfig.sidebarDepth,
      $themeConfig.sidebarDepth,
      1,
    ].find(depth => depth !== undefined);

    const displayAllHeaders =
      $themeLocaleConfig.displayAllHeaders || $themeConfig.displayAllHeaders;

    if (item.type === 'auto') {
      return [
        link,
        renderChildren(h, item.children, item.basePath, $route, maxDepth),
      ];
    } else if (
      (active || displayAllHeaders) &&
      item.headers &&
      !hashRE.test(item.path)
    ) {
      const children = groupHeaders(item.headers);
      return [link, renderChildren(h, children, item.path, $route, maxDepth)];
    } else {
      return link;
    }
  },
};

function renderLink(h, to, text, active) {
  return h(
    'router-link',
    {
      props: {
        to,
        exactActiveClass: 'text-indigo-700 bg-indigo-100 border-indigo-500',
      },
      class: [
        'block text-sm text-gray-600 hover:text-indigo-700 font-medium hover:font-semibold px-3 py-1 w-full border-l-4 border-transparent rounded',
        { active },
      ],
    },
    text,
  );
}

function renderChildren(h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null;
  return h(
    'ul',
    { class: ['pl-3 list-none'] },
    children.map(c => {
      const active = isActive(route, path + '#' + c.slug);
      return h('li', { class: 'sidebar-sub-header', 'font-semibold': active }, [
        renderLink(h, path + '#' + c.slug, c.title, active),
        renderChildren(h, c.children, path, route, maxDepth, depth + 1),
      ]);
    }),
  );
}

function renderExternal(h, to, text) {
  return h(
    'a',
    {
      attrs: {
        href: to,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      class: {
        'sidebar-link': true,
      },
    },
    [text, h('OutboundLink')],
  );
}
</script>

<style lang="stylus">
// a.sidebar-link {
//   .sidebar-sub-headers & {
//     padding-top: 0.25rem;
//     padding-bottom: 0.25rem;
//     border-left: none;

//     &.active {
//       font-weight: 500;
//     }
//   }
// }
</style>
