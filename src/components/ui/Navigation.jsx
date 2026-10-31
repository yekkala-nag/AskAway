/**
 * Navigation Components barrel — re-exports split shell modules.
 * `TopBar` is static (rendered on first paint).
 * `Sidebar` and `CommandPalette` are lazy-loaded by the app shell.
 */

export { Sidebar } from './Sidebar.jsx';
export { TopBar, ModuleSwitcher } from './TopBar.jsx';
