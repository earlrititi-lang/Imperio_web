import { NAV_ITEMS } from "../config/navigation";

export default function NavLinksList({
  items = NAV_ITEMS,
  className = "",
  linkClassName = "",
  itemKeyPrefix = "",
  ghost = false,
}) {
  return (
    <ul class={className}>
      {items.map((item, index) => (
        <li key={`${itemKeyPrefix}${item.href ?? item.label ?? index}`}>
          {ghost ? (
            <span class={`nav-link ${linkClassName}`.trim()}>{item.label}</span>
          ) : (
            <a href={item.href} class={`nav-link ${linkClassName}`.trim()}>
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
